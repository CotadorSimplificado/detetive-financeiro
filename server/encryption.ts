import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

/**
 * Utilitário de criptografia AES-256 para dados financeiros sensíveis
 * Protege informações críticas como saldos, limites e valores de transações
 */

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY_ENV = 'ENCRYPTION_KEY';

// Gera chave de criptografia a partir da variável de ambiente ou falha
function getEncryptionKey(): Buffer {
  const key = process.env[ENCRYPTION_KEY_ENV];
  if (!key) {
    throw new Error(`${ENCRYPTION_KEY_ENV} environment variable is required for data encryption`);
  }
  
  // Hash da chave para garantir 32 bytes (AES-256)
  return createHash('sha256').update(key).digest();
}

/**
 * Criptografa dados sensíveis usando AES-256-CBC
 */
export function encryptSensitiveData(text: string | number): string {
  try {
    if (!text && text !== 0) return '';
    
    const key = getEncryptionKey();
    const iv = randomBytes(16); // Initialization Vector único para cada criptografia
    const cipher = createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text.toString(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Retorna IV + dados criptografados (hex)
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('[SECURITY] Encryption failed:', error);
    throw new Error('Failed to encrypt sensitive data');
  }
}

/**
 * Descriptografa dados sensíveis usando AES-256-CBC
 */
export function decryptSensitiveData(encryptedData: string): string {
  try {
    if (!encryptedData) return '';
    
    const key = getEncryptionKey();
    const parts = encryptedData.split(':');
    
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[SECURITY] Decryption failed:', error);
    throw new Error('Failed to decrypt sensitive data');
  }
}

/**
 * Criptografa valores decimais/monetários
 */
export function encryptDecimal(value: string | number): string {
  if (!value && value !== 0) return '';
  return encryptSensitiveData(value.toString());
}

/**
 * Descriptografa valores decimais/monetários
 */
export function decryptDecimal(encryptedValue: string): string {
  if (!encryptedValue) return '0';
  return decryptSensitiveData(encryptedValue);
}

/**
 * Criptografa dados de conta bancária (números sensíveis)
 */
export function encryptBankingData(data: string): string {
  if (!data) return '';
  return encryptSensitiveData(data);
}

/**
 * Descriptografa dados de conta bancária
 */
export function decryptBankingData(encryptedData: string): string {
  if (!encryptedData) return '';
  return decryptSensitiveData(encryptedData);
}

/**
 * Campos sensíveis que devem ser criptografados
 * Focando apenas em dados de identificação pessoal sensíveis
 */
export const SENSITIVE_FIELDS = {
  ACCOUNT: ['accountNumber', 'agency'], // Dados bancários sensíveis
  TRANSACTION: [], // Sem criptografia por ora (valores financeiros ficam como decimal)
  CREDIT_CARD: ['lastFourDigits'], // Apenas últimos dígitos por questões de segurança
  CREDIT_CARD_BILL: [], // Valores financeiros ficam como decimal
  MONTHLY_PLAN: [], // Valores financeiros ficam como decimal  
  CATEGORY_BUDGET: [] // Valores financeiros ficam como decimal
};

/**
 * Verifica se a criptografia está configurada corretamente
 */
export function validateEncryptionSetup(): boolean {
  try {
    const testData = 'test-encryption-validation';
    const encrypted = encryptSensitiveData(testData);
    const decrypted = decryptSensitiveData(encrypted);
    
    if (decrypted !== testData) {
      throw new Error('Encryption validation failed - data mismatch');
    }
    
    console.log('[SECURITY] ✅ Data encryption validation successful');
    return true;
  } catch (error) {
    console.error('[SECURITY] ❌ Data encryption validation failed:', error);
    return false;
  }
}

/**
 * Utilitário para criptografar objeto com campos sensíveis
 */
export function encryptObjectFields<T extends Record<string, any>>(
  obj: T, 
  fieldsToEncrypt: string[]
): T {
  const encrypted = { ...obj };
  
  for (const field of fieldsToEncrypt) {
    if (encrypted[field] !== undefined && encrypted[field] !== null) {
      (encrypted as any)[field] = encryptSensitiveData(encrypted[field]);
    }
  }
  
  return encrypted;
}

/**
 * Utilitário para descriptografar objeto com campos sensíveis
 */
export function decryptObjectFields<T extends Record<string, any>>(
  obj: T, 
  fieldsToDecrypt: string[]
): T {
  const decrypted = { ...obj };
  
  for (const field of fieldsToDecrypt) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      try {
        (decrypted as any)[field] = decryptSensitiveData(decrypted[field]);
      } catch (error) {
        console.warn(`[SECURITY] Failed to decrypt field ${field}:`, error);
        // Manter valor original se descriptografia falhar
      }
    }
  }
  
  return decrypted;
}