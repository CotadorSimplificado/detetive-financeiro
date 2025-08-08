import { db } from '../db';
import { categories } from '@shared/schema';
import { isNull } from 'drizzle-orm';
import { validateEncryptionSetup } from '../encryption';

// Categorias padrão do sistema financeiro brasileiro - Expandidas
const defaultCategories = [
  // ===== CATEGORIAS DE RECEITA =====
  { name: 'Salário', type: 'INCOME', icon: 'Briefcase', color: '#22c55e' },
  { name: 'Freelance', type: 'INCOME', icon: 'Laptop', color: '#3b82f6' },
  { name: 'Investimentos', type: 'INCOME', icon: 'TrendingUp', color: '#10b981' },
  { name: 'Bonificação', type: 'INCOME', icon: 'Gift', color: '#f59e0b' },
  { name: 'Vendas', type: 'INCOME', icon: 'ShoppingBag', color: '#06b6d4' },
  { name: 'Décimo Terceiro', type: 'INCOME', icon: 'Calendar', color: '#22c55e' },
  { name: 'Férias', type: 'INCOME', icon: 'Plane', color: '#3b82f6' },
  { name: 'Aluguel Recebido', type: 'INCOME', icon: 'Home', color: '#10b981' },
  { name: 'Restituição IR', type: 'INCOME', icon: 'Receipt', color: '#f59e0b' },
  { name: 'Outras Receitas', type: 'INCOME', icon: 'Plus', color: '#8b5cf6' },

  // ===== CATEGORIAS DE DESPESA =====
  
  // Moradia (mais detalhado)
  { name: 'Aluguel', type: 'EXPENSE', icon: 'Home', color: '#ef4444' },
  { name: 'Condomínio', type: 'EXPENSE', icon: 'Building', color: '#f97316' },
  { name: 'IPTU', type: 'EXPENSE', icon: 'Receipt', color: '#eab308' },
  { name: 'Energia Elétrica', type: 'EXPENSE', icon: 'Zap', color: '#f59e0b' },
  { name: 'Água', type: 'EXPENSE', icon: 'Droplets', color: '#3b82f6' },
  { name: 'Gás', type: 'EXPENSE', icon: 'Flame', color: '#ef4444' },
  { name: 'Internet', type: 'EXPENSE', icon: 'Wifi', color: '#8b5cf6' },
  
  // Alimentação (mais detalhado)
  { name: 'Supermercado', type: 'EXPENSE', icon: 'ShoppingCart', color: '#22c55e' },
  { name: 'Restaurantes', type: 'EXPENSE', icon: 'Utensils', color: '#f97316' },
  { name: 'Delivery', type: 'EXPENSE', icon: 'Truck', color: '#f59e0b' },
  { name: 'Lanche', type: 'EXPENSE', icon: 'Coffee', color: '#8b5cf6' },
  
  // Transporte (mais detalhado)
  { name: 'Combustível', type: 'EXPENSE', icon: 'Fuel', color: '#ef4444' },
  { name: 'Transporte Público', type: 'EXPENSE', icon: 'Bus', color: '#3b82f6' },
  { name: 'Uber/Taxi', type: 'EXPENSE', icon: 'Car', color: '#f59e0b' },
  { name: 'Estacionamento', type: 'EXPENSE', icon: 'Car', color: '#6b7280' },
  { name: 'Manutenção Veículo', type: 'EXPENSE', icon: 'Wrench', color: '#dc2626' },
  
  // Saúde (mais detalhado)
  { name: 'Plano de Saúde', type: 'EXPENSE', icon: 'Heart', color: '#ec4899' },
  { name: 'Remédios', type: 'EXPENSE', icon: 'Pill', color: '#8b5cf6' },
  { name: 'Consultas Médicas', type: 'EXPENSE', icon: 'Stethoscope', color: '#10b981' },
  { name: 'Dentista', type: 'EXPENSE', icon: 'Smile', color: '#06b6d4' },
  
  // Educação
  { name: 'Escola/Faculdade', type: 'EXPENSE', icon: 'GraduationCap', color: '#8b5cf6' },
  { name: 'Cursos', type: 'EXPENSE', icon: 'BookOpen', color: '#3b82f6' },
  { name: 'Livros', type: 'EXPENSE', icon: 'Book', color: '#22c55e' },
  
  // Lazer (expandido)
  { name: 'Cinema', type: 'EXPENSE', icon: 'Film', color: '#f97316' },
  { name: 'Streaming', type: 'EXPENSE', icon: 'Tv', color: '#8b5cf6' },
  { name: 'Academia', type: 'EXPENSE', icon: 'Dumbbell', color: '#ef4444' },
  { name: 'Viagens', type: 'EXPENSE', icon: 'Plane', color: '#3b82f6' },
  { name: 'Jogos', type: 'EXPENSE', icon: 'GameController2', color: '#06b6d4' },
  
  // Vestuário
  { name: 'Roupas', type: 'EXPENSE', icon: 'Shirt', color: '#84cc16' },
  { name: 'Calçados', type: 'EXPENSE', icon: 'Footprints', color: '#6b7280' },
  
  // Financeiro
  { name: 'Cartão de Crédito', type: 'EXPENSE', icon: 'CreditCard', color: '#ef4444' },
  { name: 'Empréstimos', type: 'EXPENSE', icon: 'Banknote', color: '#dc2626' },
  { name: 'Taxas Bancárias', type: 'EXPENSE', icon: 'Building2', color: '#6b7280' },
  { name: 'Impostos', type: 'EXPENSE', icon: 'Receipt', color: '#dc2626' },
  { name: 'Seguros', type: 'EXPENSE', icon: 'Shield', color: '#7c3aed' },
  
  // Tecnologia
  { name: 'Celular', type: 'EXPENSE', icon: 'Smartphone', color: '#6366f1' },
  { name: 'Software', type: 'EXPENSE', icon: 'Monitor', color: '#8b5cf6' },
  { name: 'Hardware', type: 'EXPENSE', icon: 'Cpu', color: '#3b82f6' },
  
  // Outros
  { name: 'Pets', type: 'EXPENSE', icon: 'Heart', color: '#f59e0b' },
  { name: 'Presentes', type: 'EXPENSE', icon: 'Gift', color: '#ec4899' },
  { name: 'Doações', type: 'EXPENSE', icon: 'Heart', color: '#059669' },
  { name: 'Beleza', type: 'EXPENSE', icon: 'Sparkles', color: '#ec4899' },
  { name: 'Outras Despesas', type: 'EXPENSE', icon: 'Minus', color: '#6b7280' },
];

export async function seedDefaultCategories() {
  try {
    console.log('🌱 Populando categorias padrão...');
    
    // Verifica se já existem categorias padrão
    const existingCategories = await db
      .select()
      .from(categories)
      .where(isNull(categories.userId));
    
    if (existingCategories.length > 0) {
      console.log('✅ Categorias padrão já existem, pulando seed');
      return;
    }

    // Insere as categorias padrão
    await db.insert(categories).values(
      defaultCategories.map(cat => ({
        ...cat,
        userId: null, // null = categoria padrão do sistema
        isDefault: true,
      }))
    );

    const incomeCount = defaultCategories.filter(c => c.type === 'INCOME').length;
    const expenseCount = defaultCategories.filter(c => c.type === 'EXPENSE').length;
    console.log(`✅ ${defaultCategories.length} categorias padrão inseridas com sucesso`);
    console.log(`   📈 ${incomeCount} categorias de receita`);
    console.log(`   📉 ${expenseCount} categorias de despesa`);
    
  } catch (error) {
    console.error('❌ Erro ao popular categorias padrão:', error);
    throw error;
  }
}

export async function seedDatabase() {
  console.log('🚀 Iniciando seed do banco de dados...');
  
  // Validar criptografia antes de começar
  console.log('🔐 Validando configuração de criptografia...');
  if (!validateEncryptionSetup()) {
    console.error('❌ Configuração de criptografia falhou - verifique ENCRYPTION_KEY');
    process.exit(1);
  }
  console.log('✅ Criptografia validada com sucesso');
  
  try {
    await seedDefaultCategories();
    
    const incomeCount = defaultCategories.filter(c => c.type === 'INCOME').length;
    const expenseCount = defaultCategories.filter(c => c.type === 'EXPENSE').length;
    
    console.log('✅ Seed concluído com sucesso!');
    console.log(`   📊 Total de categorias: ${defaultCategories.length}`);
    console.log(`   📈 Receitas: ${incomeCount} categorias`);
    console.log(`   📉 Despesas: ${expenseCount} categorias`);
    console.log('   🔐 Dados protegidos com criptografia AES-256');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  }
}

// Executa o seed se este arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}