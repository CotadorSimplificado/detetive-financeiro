import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth, setupAuthRoutes } from "./auth";

// ===== SEGURANÇA - SANITIZAÇÃO DE LOGS =====

// Lista de campos sensíveis que devem ser filtrados dos logs
const SENSITIVE_FIELDS = [
  'password', 
  'token', 
  'access_token', 
  'refresh_token', 
  'session',
  'amount', 
  'balance', 
  'limit', 
  'availableLimit',
  'accountNumber',
  'agency',
  'lastFourDigits',
  'email', // Em alguns casos pode ser sensível
  'session_id',
  'sessionId'
];

// Função para sanitizar objetos removendo campos sensíveis
function sanitizeForLogging(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  
  // Se é um array, sanitizar cada item
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForLogging(item));
  }
  
  // Criar cópia do objeto
  const sanitized = { ...obj };
  
  // Filtrar campos sensíveis
  SENSITIVE_FIELDS.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '[FILTERED]';
    }
  });
  
  // Recursivamente sanitizar objetos aninhados
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeForLogging(sanitized[key]);
    }
  });
  
  return sanitized;
}

// ===== SEGURANÇA - RATE LIMITING =====

// Store para controle de rate limiting (em produção usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Limpar registros expirados a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Middleware de rate limiting
function createRateLimiter(options: { maxRequests: number; windowMs: number; message: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${clientIP}:${req.path}`;
    const now = Date.now();
    
    let clientData = rateLimitStore.get(key);
    
    if (!clientData || now > clientData.resetTime) {
      // Primeira request ou janela expirada
      clientData = {
        count: 1,
        resetTime: now + options.windowMs
      };
      rateLimitStore.set(key, clientData);
      return next();
    }
    
    if (clientData.count >= options.maxRequests) {
      // Limite excedido
      const remainingTime = Math.ceil((clientData.resetTime - now) / 1000);
      res.set({
        'X-RateLimit-Limit': options.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': clientData.resetTime.toString(),
        'Retry-After': remainingTime.toString()
      });
      return res.status(429).json({ 
        error: options.message,
        retryAfter: remainingTime
      });
    }
    
    // Incrementar contador
    clientData.count++;
    rateLimitStore.set(key, clientData);
    
    // Adicionar headers informativos
    res.set({
      'X-RateLimit-Limit': options.maxRequests.toString(),
      'X-RateLimit-Remaining': (options.maxRequests - clientData.count).toString(),
      'X-RateLimit-Reset': clientData.resetTime.toString()
    });
    
    next();
  };
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SEGURANÇA: Aplicar rate limiting nas rotas da API
const apiRateLimit = createRateLimiter({
  maxRequests: 100, // 100 requests por IP
  windowMs: 15 * 60 * 1000, // 15 minutos
  message: 'Too many API requests, please try again later'
});

const authRateLimit = createRateLimiter({
  maxRequests: 5, // 5 tentativas de login por IP
  windowMs: 15 * 60 * 1000, // 15 minutos
  message: 'Too many authentication attempts, please try again later'
});

// Aplicar rate limiting
app.use('/api/', apiRateLimit);
app.use('/api/auth/login', authRateLimit);
app.use('/api/auth/register', authRateLimit);

// Setup authentication with PostgreSQL
setupAuth(app);
setupAuthRoutes(app);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        // SEGURANÇA: Sanitizar dados sensíveis antes de logar
        const sanitizedResponse = sanitizeForLogging(capturedJsonResponse);
        logLine += ` :: ${JSON.stringify(sanitizedResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
