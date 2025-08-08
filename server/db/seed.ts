import { db } from '../db';
import { categories } from '@shared/schema';
import { isNull } from 'drizzle-orm';

// Categorias padrão do sistema
const defaultCategories = [
  // Categorias de Receita
  { name: 'Salário', type: 'INCOME', icon: 'Briefcase', color: '#22c55e' },
  { name: 'Freelance', type: 'INCOME', icon: 'Laptop', color: '#3b82f6' },
  { name: 'Investimentos', type: 'INCOME', icon: 'TrendingUp', color: '#10b981' },
  { name: 'Bonificação', type: 'INCOME', icon: 'Gift', color: '#f59e0b' },
  { name: 'Vendas', type: 'INCOME', icon: 'ShoppingBag', color: '#06b6d4' },
  { name: 'Outras Receitas', type: 'INCOME', icon: 'Plus', color: '#8b5cf6' },

  // Categorias de Despesa
  { name: 'Alimentação', type: 'EXPENSE', icon: 'Utensils', color: '#ef4444' },
  { name: 'Transporte', type: 'EXPENSE', icon: 'Car', color: '#f97316' },
  { name: 'Moradia', type: 'EXPENSE', icon: 'Home', color: '#eab308' },
  { name: 'Saúde', type: 'EXPENSE', icon: 'Heart', color: '#ec4899' },
  { name: 'Educação', type: 'EXPENSE', icon: 'GraduationCap', color: '#8b5cf6' },
  { name: 'Lazer', type: 'EXPENSE', icon: 'GameController2', color: '#06b6d4' },
  { name: 'Roupas', type: 'EXPENSE', icon: 'Shirt', color: '#84cc16' },
  { name: 'Tecnologia', type: 'EXPENSE', icon: 'Smartphone', color: '#6366f1' },
  { name: 'Pets', type: 'EXPENSE', icon: 'Heart', color: '#f59e0b' },
  { name: 'Impostos', type: 'EXPENSE', icon: 'Receipt', color: '#dc2626' },
  { name: 'Seguros', type: 'EXPENSE', icon: 'Shield', color: '#7c3aed' },
  { name: 'Doações', type: 'EXPENSE', icon: 'Heart', color: '#059669' },
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

    console.log(`✅ ${defaultCategories.length} categorias padrão inseridas com sucesso`);
    
  } catch (error) {
    console.error('❌ Erro ao popular categorias padrão:', error);
    throw error;
  }
}

export async function seedDatabase() {
  console.log('🚀 Iniciando seed do banco de dados...');
  
  try {
    await seedDefaultCategories();
    console.log('✅ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  }
}

// Executa o seed se este arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}