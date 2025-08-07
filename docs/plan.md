# Documento de Requisitos do Produto (PRD) - Detetive Financeiro

## Informações do Documento
- **Produto:** Detetive Financeiro - Sistema de Gestão Financeira Pessoal Inteligente
- **Versão:** 2.0
- **Data:** 07 de Agosto de 2025
- **Status:** Em Revisão

## Histórico de Versões
- **v1.1:** Versão inicial com a definição das principais funcionalidades
- **v1.2:** Versão enriquecida com base na análise visual de telas de referência (Mobills)
- **v2.0:** Versão completa incluindo segurança, requisitos não-funcionais, IA avançada, e roadmap detalhado

## Índice
1. [Visão Executiva](#visão-executiva)
2. [Objetivos e KPIs](#objetivos-e-kpis)
3. [Arquitetura de Módulos](#arquitetura-de-módulos)
4. [Requisitos Funcionais](#requisitos-funcionais)
5. [Requisitos Não-Funcionais](#requisitos-não-funcionais)
6. [Segurança e Privacidade](#segurança-e-privacidade)
7. [Inteligência Artificial e Machine Learning](#inteligência-artificial-e-machine-learning)
8. [Integrações e APIs](#integrações-e-apis)
9. [Experiência do Usuário (UX/UI)](#experiência-do-usuário-uxui)
10. [Roadmap e Priorização](#roadmap-e-priorização)
11. [Critérios de Aceitação](#critérios-de-aceitação)
12. [Glossário](#glossário)
13. [Anexos](#anexos)

---

## 1. Visão Executiva

### 1.1 Missão do Produto
O **Detetive Financeiro** é uma plataforma web responsiva de gestão financeira pessoal que utiliza inteligência artificial para transformar dados financeiros complexos em insights acionáveis, capacitando usuários a tomar decisões financeiras mais inteligentes e alcançar seus objetivos econômicos.

### 1.2 Proposta de Valor
- **Para usuários individuais:** Controle total sobre suas finanças com insights preditivos e recomendações personalizadas
- **Para famílias:** Gestão colaborativa com transparência e metas compartilhadas
- **Para profissionais liberais:** Separação clara entre finanças pessoais e profissionais com relatórios para declaração fiscal

### 1.3 Diferenciais Competitivos
- IA que "investiga" padrões de gastos e identifica oportunidades de economia
- Categorização automática com 95%+ de precisão
- Integração nativa com Open Finance
- Interface adaptativa que aprende com o comportamento do usuário
- Sistema de alertas proativos e educação financeira contextual

---

## 2. Objetivos e KPIs

### 2.1 Objetivos de Negócio
- Alcançar 100.000 usuários ativos mensais em 12 meses
- Atingir NPS > 70
- Gerar economia média de R$ 500/mês por usuário ativo

### 2.2 KPIs Principais
| Métrica | Meta (6 meses) | Meta (12 meses) |
|---------|----------------|-----------------|
| MAU (Monthly Active Users) | 25.000 | 100.000 |
| Retenção (30 dias) | 60% | 75% |
| Transações categorizadas automaticamente | 85% | 95% |
| Tempo médio de sessão | 8 min | 12 min |
| Usuários com metas configuradas | 40% | 60% |
| NPS | 60 | 70+ |
| Uptime | 99.5% | 99.9% |

### 2.3 Métricas de Qualidade
- Tempo de resposta da API < 200ms (P95)
- Taxa de erro < 0.1%
- Tempo de carregamento inicial < 3 segundos
- Score de acessibilidade WCAG > 95

---

## 3. Arquitetura de Módulos

### 3.1 Módulos Principais
1. **Dashboard Inteligente** - Centro de comando personalizado
2. **Contas** - Gestão de contas bancárias e carteiras
3. **Cartões de Crédito** - Controle completo de cartões e faturas
4. **Transações** - Registro e categorização de movimentações
5. **Orçamentos** - Planejamento e controle de gastos
6. **Investimentos** - Acompanhamento de patrimônio e rentabilidade
7. **Relatórios** - Análises visuais e insights
8. **Metas Financeiras** - Objetivos e planejamento de longo prazo
9. **Configurações** - Personalização e preferências
10. **Central de Notificações** - Alertas e comunicações

### 3.2 Módulos de Suporte
- **Autenticação e Segurança**
- **Sincronização e Importação**
- **Assistente Virtual (IA)**
- **Educação Financeira**
- **Exportação e Relatórios Fiscais**

---

## 4. Requisitos Funcionais

### 4.1 Dashboard Inteligente

#### 4.1.1 Estrutura e Personalização
- **Cards modulares** com drag-and-drop para reorganização
- **Modo de edição** com catálogo de widgets disponíveis
- **Layouts predefinidos** (Iniciante, Intermediário, Avançado, Investidor)
- **Sincronização de layout** entre dispositivos

#### 4.1.2 Cards Essenciais
- **Saldo Consolidado**
  - Valor total agregado com projeção para fim do mês
  - Toggle para mostrar/ocultar valores
  - Indicador de tendência (↑↓)
  
- **Fluxo de Caixa**
  - Receitas vs Despesas do mês
  - Balanço atual e projetado
  - Mini-gráfico de tendência

- **Despesas por Categoria**
  - Gráfico donut interativo
  - Top 5 categorias com valores e percentuais
  - Comparativo com mês anterior

- **Status dos Cartões**
  - Faturas abertas agregadas
  - Limite disponível total
  - Alerta de vencimentos próximos

- **Metas do Mês**
  - Progresso das metas ativas
  - Indicadores visuais de performance
  - Sugestões de ajuste

- **Insights do Detetive**
  - Card com 3 insights prioritários
  - Atualização diária baseada em IA
  - Ações diretas a partir dos insights

### 4.2 Gestão de Transações

#### 4.2.1 Criação de Lançamentos
- **FAB (Floating Action Button)** com menu radial
- **Tipos de lançamento:**
  - Receita (única, fixa, parcelada)
  - Despesa (única, fixa, parcelada)
  - Transferência entre contas
  - Despesa de cartão (à vista, parcelada, recorrente)
  
#### 4.2.2 Formulário Inteligente
- **Campos dinâmicos** baseados no tipo de transação
- **Teclado numérico customizado** com operações matemáticas
- **Sugestões baseadas em IA:**
  - Categoria automaticamente sugerida
  - Descrição baseada em histórico
  - Tags relevantes propostas

#### 4.2.3 Funcionalidades Avançadas
- **OCR para comprovantes** (foto ou PDF)
- **Divisão de despesas** entre múltiplas pessoas
- **Anexos múltiplos** (comprovantes, notas, contratos)
- **Geolocalização opcional** para despesas
- **Agendamento** com notificações prévias

#### 4.2.4 Recorrência e Parcelamento
- **Modal de edição contextual:**
  - Editar apenas esta ocorrência
  - Editar esta e futuras
  - Editar todas (incluindo passadas)
  - Cancelar futuras
- **Visualização de parcelas** em timeline
- **Recálculo automático** de juros em parcelamentos

### 4.3 Módulo de Contas

#### 4.3.1 Tipos de Conta Suportados
- Conta Corrente
- Poupança
- Investimentos (CDB, Tesouro, Ações)
- Carteira física
- Conta Internacional (multi-moeda)
- Caixinhas/Reservas

#### 4.3.2 Funcionalidades
- **Sincronização automática** via Open Finance
- **Saldo atual vs Saldo projetado**
- **Histórico de saldos** com gráfico
- **Reconciliação assistida** por IA
- **Agrupamento de contas** (pessoal, família, empresa)

### 4.4 Módulo de Cartões de Crédito

#### 4.4.1 Gestão de Cartões
- **Múltiplos cartões** com limites independentes
- **Cartões virtuais** vinculados ao principal
- **Compartilhamento familiar** com limites individuais
- **Melhor data de compra** calculada automaticamente

#### 4.4.2 Gestão de Faturas
- **Timeline visual** de faturas
- **Detalhamento por fatura:**
  - Compras nacionais/internacionais
  - Parcelamentos em andamento
  - Taxas e encargos
  - Compras por categoria
- **Simulador de parcelamento** da fatura
- **Alerta de melhor cartão** para usar no dia

### 4.5 Módulo de Orçamentos

#### 4.5.1 Criação de Orçamentos
- **Templates predefinidos** por perfil
- **Orçamento por categoria** com subcategorias
- **Orçamento por período** (mensal, trimestral, anual)
- **Orçamento por projeto** (viagem, reforma, festa)

#### 4.5.2 Monitoramento
- **Alertas progressivos** (50%, 75%, 90%, 100%)
- **Recomendações de ajuste** baseadas em IA
- **Rollover de saldo** não utilizado
- **Comparativo** com períodos anteriores

### 4.6 Módulo de Investimentos

#### 4.6.1 Funcionalidades
- **Integração com corretoras** principais
- **Consolidação de patrimônio**
- **Rentabilidade** por ativo e consolidada
- **Análise de diversificação**
- **Simuladores** de aposentadoria e objetivos
- **Alertas de rebalanceamento**

### 4.7 Módulo de Relatórios

#### 4.7.1 Tipos de Visualização
- **Gráficos de Rosca:** Distribuição e proporção
- **Gráficos de Linha:** Tendências e evolução
- **Gráficos de Barra:** Comparativos
- **Heatmap:** Padrões de gastos por dia/hora
- **Treemap:** Hierarquia de categorias
- **Waterfall:** Fluxo de caixa detalhado

#### 4.7.2 Relatórios Predefinidos
- Análise Mensal Completa
- Evolução Patrimonial
- Performance de Investimentos
- Análise de Categorias
- Comparativo de Períodos
- Previsão de Fluxo de Caixa
- Relatório Fiscal Anual

#### 4.7.3 Funcionalidades Interativas
- **Drill-down** em todos os gráficos
- **Filtros dinâmicos** salvos
- **Exportação** (PDF, Excel, CSV)
- **Compartilhamento** seguro
- **Narrativa automática** gerada por IA

### 4.8 Metas Financeiras

#### 4.8.1 Tipos de Meta
- Economia para objetivo específico
- Redução de gastos por categoria
- Quitação de dívidas
- Formação de reserva de emergência
- Meta de investimento

#### 4.8.2 Funcionalidades
- **Calculadora de metas** com cenários
- **Acompanhamento visual** do progresso
- **Sugestões de otimização** por IA
- **Marcos intermediários** com celebrações
- **Compartilhamento** com accountability partner

---

## 5. Requisitos Não-Funcionais

### 5.1 Performance
| Métrica | Requisito | Crítico |
|---------|-----------|---------|
| Tempo de carregamento inicial | < 3s | < 5s |
| Tempo de resposta da API | < 200ms (P95) | < 500ms |
| Renderização de gráficos | < 1s | < 2s |
| Busca e filtros | < 500ms | < 1s |
| Importação de 1000 transações | < 10s | < 30s |
| Sincronização Open Finance | < 5s | < 15s |

### 5.2 Escalabilidade
- Suportar 1 milhão de usuários simultâneos
- Processar 10.000 transações/segundo
- Armazenar histórico de 10 anos por usuário
- Auto-scaling horizontal automático

### 5.3 Disponibilidade
- **SLA:** 99.9% de uptime (menos de 43 minutos de indisponibilidade/mês)
- **RTO (Recovery Time Objective):** < 1 hora
- **RPO (Recovery Point Objective):** < 15 minutos
- **Manutenção programada:** Máximo 4 horas/mês em horário de baixo uso

### 5.4 Compatibilidade
- **Navegadores:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos:** Responsivo de 320px a 4K
- **PWA:** Instalável em iOS e Android
- **Offline:** Funcionalidades básicas offline com sincronização posterior

### 5.5 Capacidade e Limites
| Recurso | Limite Padrão | Limite Premium |
|---------|---------------|----------------|
| Contas | 10 | Ilimitado |
| Cartões | 10 | Ilimitado |
| Transações/mês | 500 | Ilimitado |
| Categorias customizadas | 20 | 100 |
| Metas simultâneas | 5 | 20 |
| Histórico | 2 anos | 10 anos |
| Anexos/mês | 50 | 500 |
| Usuários família | 2 | 5 |

---

## 6. Segurança e Privacidade

### 6.1 Autenticação e Autorização
- **Autenticação multifator (MFA)** obrigatória
- **Biometria** (impressão digital, Face ID, Windows Hello)
- **SSO** com Google, Apple, Microsoft
- **Sessões seguras** com timeout configurável
- **Tokens JWT** com refresh token
- **Rate limiting** por IP e usuário

### 6.2 Criptografia
- **Em trânsito:** TLS 1.3 mínimo
- **Em repouso:** AES-256-GCM
- **Dados sensíveis:** Criptografia em nível de campo
- **Backups:** Criptografados com chaves rotativas
- **Tokens de API:** Hashing com bcrypt

### 6.3 Privacidade e Conformidade
- **LGPD:** Conformidade total
- **PCI DSS:** Level 2 para dados de cartão
- **ISO 27001:** Certificação planejada
- **Direito ao esquecimento:** Exclusão completa em 30 dias
- **Portabilidade:** Exportação em formatos abertos
- **Consentimento granular:** Por tipo de dado e finalidade

### 6.4 Auditoria e Monitoramento
- **Log de todas as ações** financeiras
- **Alertas de acesso suspeito**
- **Histórico de alterações** com versionamento
- **Relatório de atividades** mensal para usuário
- **Detecção de anomalias** por ML
- **Notificação de novos dispositivos**

### 6.5 Segurança de Dados
- **Segregação** de dados por tenant
- **Mascaramento** de dados em logs
- **Validação** de entrada em todos os campos
- **Proteção contra** OWASP Top 10
- **Testes de penetração** trimestrais
- **Bug bounty program**

---

## 7. Inteligência Artificial e Machine Learning

### 7.1 Categorização Inteligente
- **Modelo de ML** treinado com 1M+ de transações brasileiras
- **Precisão alvo:** 95% na primeira sugestão
- **Aprendizado contínuo** com feedback do usuário
- **Detecção de novos padrões** de comerciantes
- **Sugestão de subcategorias** baseada em contexto
- **Criação automática** de regras personalizadas

### 7.2 Assistente Virtual - "Detetive"
- **Processamento de linguagem natural** em português
- **Consultas suportadas:**
  - "Quanto gastei com delivery este mês?"
  - "Mostre minhas despesas fixas"
  - "Crie um orçamento para viagem"
  - "Analise meus gastos com supermercado"
- **Ações executáveis** via chat
- **Sugestões proativas** baseadas em contexto
- **Modo voz** para acessibilidade

### 7.3 Análise Preditiva
- **Previsão de saldo** em 30, 60, 90 dias
- **Detecção de anomalias** em gastos
- **Identificação de cobranças** duplicadas/indevidas
- **Previsão de economia** potencial
- **Risco de inadimplência** alertas preventivos
- **Otimização de uso** de cartões de crédito

### 7.4 Insights Personalizados
- **Perfil financeiro** do usuário (conservador, moderado, arrojado)
- **Comparação anônima** com perfis similares
- **Oportunidades de economia** específicas
- **Educação contextual** baseada em comportamento
- **Gamificação** com desafios personalizados
- **Coaching financeiro** automatizado

### 7.5 Automação Inteligente
- **Regras automáticas** baseadas em padrões
- **Categorização em lote** de transações similares
- **Sugestão de metas** baseadas em histórico
- **Ajuste automático** de orçamentos
- **Lembretes inteligentes** no momento certo
- **Criação de relatórios** personalizados

---

## 8. Integrações e APIs

### 8.1 Open Finance Brasil
- **Instituições prioritárias:** Top 20 bancos
- **Dados sincronizados:**
  - Saldos e extratos
  - Faturas de cartão
  - Investimentos básicos
  - Limites e taxas
- **Frequência:** Tempo real via webhook
- **Fallback:** Polling a cada 4 horas

### 8.2 APIs de Terceiros
- **Corretoras:** XP, Rico, Clear, BTG
- **Criptomoedas:** Binance, Mercado Bitcoin
- **Fiscal:** Receita Federal (CPF/CNPJ)
- **Documentos:** Google Drive, Dropbox
- **Pagamentos:** PIX, boletos
- **E-commerce:** Análise de e-mails de compra

### 8.3 API Pública do Detetive
- **RESTful** com versionamento
- **GraphQL** para consultas complexas
- **Webhooks** para eventos
- **Rate limiting:** 1000 req/hora
- **SDKs:** JavaScript, Python, PHP
- **Sandbox** para desenvolvimento

### 8.4 Importação e Exportação
- **Importação suportada:**
  - OFX (padrão bancário)
  - CSV com mapeamento flexível
  - PDF de faturas (com OCR)
  - Excel com templates
  - Migração de outros apps

- **Exportação disponível:**
  - PDF para relatórios
  - Excel para análises
  - CSV para contabilidade
  - JSON para backup
  - XML para ERP

---

## 9. Experiência do Usuário (UX/UI)

### 9.1 Design System
- **Tema claro/escuro** com auto-switch
- **Densidade ajustável** (compacto, padrão, confortável)
- **Paleta de cores** personalizável
- **Tipografia responsiva** com scale fluido
- **Micro-animações** para feedback
- **Componentes reutilizáveis** documentados

### 9.2 Acessibilidade (WCAG 2.1 AA)
- **Navegação completa** por teclado
- **Leitores de tela** compatíveis
- **Alto contraste** disponível
- **Textos alternativos** em todos os elementos
- **Tamanho mínimo** de touch target (44x44px)
- **Indicadores não baseados** apenas em cor
- **Modo foco visível** personalizado

### 9.3 Onboarding Progressivo
- **Wizard inicial** em 5 passos:
  1. Criar conta e segurança
  2. Conectar primeira conta/cartão
  3. Importar ou criar primeiras transações
  4. Definir categorias e preferências
  5. Estabelecer primeira meta

- **Tour interativo** contextual
- **Tooltips progressivos** por feature
- **Vídeos tutoriais** opcionais
- **Checkpoints** com recompensas
- **Suporte via chat** no primeiro mês

### 9.4 Personalização
- **Dashboard customizável** por arrastar e soltar
- **Atalhos de teclado** configuráveis
- **Notificações granulares** por canal
- **Idiomas:** PT-BR, EN, ES
- **Formato de data/moeda** regional
- **Widgets para home** do smartphone

### 9.5 Mobile Experience (PWA)
- **Instalável** em iOS/Android
- **Notificações push** nativas
- **Acesso offline** às funcionalidades core
- **Sincronização** em background
- **Biometria** para acesso rápido
- **Gestos nativos** suportados

---

## 10. Roadmap e Priorização

### 10.1 MVP (Mês 1-3)
**Objetivo:** Lançamento com funcionalidades core

- ✅ Autenticação segura e onboarding
- ✅ Dashboard com 4 cards básicos
- ✅ CRUD de transações manuais
- ✅ Categorização manual e automática básica
- ✅ Gestão de contas (sem sincronização)
- ✅ Relatórios básicos (3 tipos)
- ✅ PWA responsivo

### 10.2 Fase 2 (Mês 4-6)
**Objetivo:** Integração e automação

- 🔄 Open Finance (5 principais bancos)
- 🔄 Cartões de crédito completo
- 🔄 Orçamentos por categoria
- 🔄 OCR para comprovantes
- 🔄 Notificações push
- 🔄 Metas financeiras básicas
- 🔄 Exportação de relatórios

### 10.3 Fase 3 (Mês 7-9)
**Objetivo:** Inteligência e insights

- 📋 IA para categorização (95% precisão)
- 📋 Assistente virtual beta
- 📋 Análise preditiva de saldo
- 📋 Insights personalizados
- 📋 Gestão familiar
- 📋 Investimentos básicos
- 📋 API pública beta

### 10.4 Fase 4 (Mês 10-12)
**Objetivo:** Diferenciação e growth

- 📅 20+ integrações bancárias
- 📅 Coaching financeiro por IA
- 📅 Marketplace de templates
- 📅 Gamificação completa
- 📅 Relatórios fiscais
- 📅 Integração com contadores
- 📅 Plano premium

### 10.5 Backlog Futuro
- Multi-moeda e contas internacionais
- Gestão de patrimônio avançada
- Planejamento sucessório
- Integração com e-commerce
- Modo empresarial (MEI/PJ)
- Criptomoedas e DeFi
- Social features (comparação anônima)

---

## 11. Critérios de Aceitação

### 11.1 Definition of Done (DoD)
Para considerar uma funcionalidade completa:

1. **Código**
   - Code review aprovado
   - Cobertura de testes > 80%
   - Sem débitos técnicos críticos
   - Documentação técnica atualizada

2. **Qualidade**
   - Testes unitários passando
   - Testes de integração passando
   - Testes E2E dos fluxos principais
   - Performance dentro dos SLAs

3. **Segurança**
   - Scan de vulnerabilidades limpo
   - Validação de inputs implementada
   - Auditoria de logs funcionando
   - Criptografia aplicada onde necessário

4. **UX/UI**
   - Design aprovado implementado
   - Responsivo em todas as resoluções
   - Acessibilidade validada
   - Micro-copy revisado

5. **Produto**
   - Critérios de aceitação atendidos
   - Demo para stakeholders
   - Documentação do usuário criada
   - Métricas de sucesso definidas

### 11.2 Casos de Teste por Módulo

#### Dashboard
- Carregar em menos de 3 segundos
- Permitir reorganização de cards
- Atualizar valores em tempo real
- Salvar preferências do usuário
- Funcionar offline (modo leitura)

#### Transações
- Criar transação em menos de 5 cliques
- Editar transações recorrentes corretamente
- Importar 1000 transações sem erros
- Categorizar automaticamente com 85%+ precisão
- Buscar e filtrar em menos de 500ms

#### Segurança
- Bloquear após 5 tentativas de login
- Exigir MFA para operações sensíveis
- Fazer logout automático após inatividade
- Criptografar todos os dados sensíveis
- Gerar logs auditáveis completos

### 11.3 Edge Cases e Tratamento de Erros

#### Cenários Críticos
1. **Conexão perdida durante transação**
   - Salvar em draft local
   - Sincronizar quando reconectar
   - Notificar status ao usuário

2. **Importação com dados corrompidos**
   - Validar formato antes de processar
   - Isolar transações com erro
   - Permitir correção manual
   - Gerar relatório de erros

3. **Limite de rate limiting atingido**
   - Implementar backoff exponencial
   - Cache de dados não-sensíveis
   - Fila de requisições
   - Feedback visual ao usuário

4. **Conflitos de sincronização**
   - Timestamp de última modificação
   - Resolução automática quando possível
   - UI para resolução manual
   - Histórico de mudanças

---

## 12. Glossário

| Termo | Definição |
|-------|-----------|
| **MAU** | Monthly Active Users - Usuários ativos mensais |
| **FAB** | Floating Action Button - Botão de ação flutuante |
| **OCR** | Optical Character Recognition - Reconhecimento óptico de caracteres |
| **Open Finance** | Sistema financeiro aberto brasileiro regulado pelo Banco Central |
| **PWA** | Progressive Web App - Aplicativo web progressivo |
| **SLA** | Service Level Agreement - Acordo de nível de serviço |
| **RTO** | Recovery Time Objective - Tempo objetivo de recuperação |
| **RPO** | Recovery Point Objective - Ponto objetivo de recuperação |
| **MFA** | Multi-Factor Authentication - Autenticação multifator |
| **LGPD** | Lei Geral de Proteção de Dados |
| **NPS** | Net Promoter Score - Métrica de satisfação do cliente |
| **P95** | Percentil 95 - 95% das requisições abaixo deste valor |
| **Drill-down** | Navegação do geral para o específico em dados |
| **Edge case** | Cenário extremo ou incomum de uso |
| **Rollover** | Transferência de saldo não utilizado para período seguinte |

---

## 13. Anexos

### 13.1 Wireframes e Mockups
- [Link para Figma - Dashboard]
- [Link para Figma - Mobile]
- [Link para Figma - Fluxos principais]

### 13.2 Pesquisas e Validações
- [Pesquisa de mercado - 500 respondentes]
- [Testes de usabilidade - 20 participantes]
- [Benchmark competitivo]
- [Análise de viabilidade técnica]

### 13.3 Documentação Técnica
- [Arquitetura de sistema]
- [Modelo de dados]
- [APIs e integrações]
- [Plano de segurança]

### 13.4 Matriz de Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Atraso na integração Open Finance | Alta | Alto | Começar com web scraping como fallback |
| Precisão baixa da IA | Média | Alto | Treinar com dataset brasileiro maior |
| Adoção lenta | Média | Alto | Programa de referral e onboarding gamificado |
| Problemas de performance | Baixa | Alto | Arquitetura escalável e cache agressivo |
| Vazamento de dados | Baixa | Crítico | Auditoria externa e bug bounty |

### 13.5 Plano de Lançamento
1. **Alpha fechado** (Mês 3): 100 usuários internos
2. **Beta privado** (Mês 4): 1.000 early adopters
3. **Beta público** (Mês 5): 10.000 usuários
4. **Lançamento oficial** (Mês 6): Público geral
5. **Expansão** (Mês 7-12): Growth hacking e parcerias

---

## Controle de Mudanças

| Data | Versão | Autor | Mudanças |
|------|--------|-------|----------|
| 01/08/2025 | 1.1 | Time Produto | Versão inicial |
| 05/08/2025 | 1.2 | Time Produto | Análise de referências |
| 07/08/2025 | 2.0 | Time Produto | Documento completo com todos os requisitos |

---

## Aprovações

| Stakeholder | Cargo | Data | Assinatura |
|-------------|-------|------|------------|
| [Nome] | Product Owner | ___/___/___ | __________ |
| [Nome] | Tech Lead | ___/___/___ | __________ |
| [Nome] | UX Lead | ___/___/___ | __________ |
| [Nome] | Security Officer | ___/___/___ | __________ |
| [Nome] | CEO/Sponsor | ___/___/___ | __________ |

---

*Este documento é confidencial e proprietário do Detetive Financeiro. Distribuição restrita aos stakeholders autorizados.*


// This is your Prisma schema file for Detetive Financeiro
// Learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum SubscriptionTier {
  FREE
  PREMIUM
  BUSINESS
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  PAST_DUE
  TRIALING
  EXPIRED
}

enum TransactionType {
  INCOME      // Receita
  EXPENSE     // Despesa
  TRANSFER    // Transferência
}

enum RecurrenceType {
  NONE        // Sem recorrência
  DAILY       // Diária
  WEEKLY      // Semanal
  MONTHLY     // Mensal
  YEARLY      // Anual
  CUSTOM      // Personalizada
}

enum AccountType {
  CHECKING    // Conta Corrente
  SAVINGS     // Poupança
  CASH        // Dinheiro/Carteira
  PREPAID     // Pré-pago
  INVESTMENT  // Investimento (futuro)
  OTHER       // Outros
}

enum CardType {
  CREDIT      // Crédito
  DEBIT       // Débito
  CREDIT_DEBIT // Múltiplo
  PREPAID     // Pré-pago
  VIRTUAL     // Virtual
}

enum CardBrand {
  VISA
  MASTERCARD
  ELO
  AMEX
  HIPERCARD
  OTHER
}

enum BudgetPeriod {
  MONTHLY
  QUARTERLY
  YEARLY
}

enum GoalStatus {
  ACTIVE
  COMPLETED
  CANCELLED
  PAUSED
}

enum NotificationType {
  TRANSACTION_SHARED
  TRANSACTION_IMPORTED
  BILL_REMINDER
  BUDGET_ALERT
  GOAL_UPDATE
  SYSTEM_UPDATE
  SECURITY_ALERT
}

enum FamilyMemberStatus {
  ACTIVE
  INACTIVE
  PENDING
  BLOCKED
}

enum SplitType {
  EQUAL       // Divisão igual
  PERCENTAGE  // Por percentual
  FIXED       // Valores fixos
  CUSTOM      // Personalizado
}

// ============================================
// USER & AUTHENTICATION
// ============================================

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  emailVerified     DateTime?
  name              String?
  avatarUrl         String?
  phone             String?
  phoneVerified     DateTime?
  
  // Security
  passwordHash      String?
  twoFactorEnabled  Boolean   @default(false)
  twoFactorSecret   String?
  lastLoginAt       DateTime?
  lastLoginIp       String?
  failedAttempts    Int       @default(0)
  lockedUntil       DateTime?
  
  // Subscription
  subscriptionTier   SubscriptionTier    @default(FREE)
  subscriptionStatus SubscriptionStatus  @default(ACTIVE)
  subscriptionEndAt  DateTime?
  trialEndAt         DateTime?
  
  // Preferences
  currency          String    @default("BRL")
  timezone          String    @default("America/Sao_Paulo")
  locale            String    @default("pt-BR")
  theme             String    @default("light")
  
  // Metadata
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime?
  
  // Relations
  accounts          Account[]
  cards             Card[]
  categories        Category[]
  transactions      Transaction[]
  budgets           Budget[]
  goals             Goal[]
  familyMembers     FamilyMember[]
  createdGroups     FamilyGroup[]      @relation("GroupCreator")
  sharedTransactions SharedTransaction[] @relation("SharedBy")
  importedTransactions ImportedTransaction[]
  notifications     Notification[]
  sessions          Session[]
  auditLogs         AuditLog[]
  dashboardWidgets  DashboardWidget[]
  
  @@index([email])
  @@index([subscriptionTier])
  @@map("users")
}

model Session {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  token         String   @unique
  userAgent     String?
  ipAddress     String?
  
  expiresAt     DateTime
  createdAt     DateTime @default(now())
  lastActivity  DateTime @default(now())
  
  @@index([userId])
  @@index([token])
  @@map("sessions")
}

// ============================================
// FINANCIAL ACCOUNTS
// ============================================

model Account {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String
  type          AccountType
  bankName      String?
  bankCode      String?
  agencyNumber  String?
  accountNumber String?
  color         String      @default("#2196F3")
  icon          String?
  
  // Balance
  currentBalance Decimal    @default(0) @db.Decimal(15, 2)
  initialBalance Decimal    @default(0) @db.Decimal(15, 2)
  
  // Open Finance
  openFinanceId     String?
  openFinanceToken  String?
  lastSyncAt        DateTime?
  syncEnabled       Boolean   @default(false)
  
  // Settings
  isActive      Boolean     @default(true)
  isDefault     Boolean     @default(false)
  includeInTotal Boolean    @default(true)
  
  // Metadata
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  deletedAt     DateTime?
  
  // Relations
  transactions      Transaction[]
  transfersFrom     Transaction[] @relation("TransferFrom")
  transfersTo       Transaction[] @relation("TransferTo")
  recurringTransactions RecurringTransaction[]
  
  @@unique([userId, name])
  @@index([userId])
  @@map("accounts")
}

// ============================================
// CREDIT CARDS
// ============================================

model Card {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String
  type          CardType
  brand         CardBrand
  lastDigits    String?   @db.VarChar(4)
  color         String    @default("#FF9800")
  
  // Limits and dates
  creditLimit   Decimal?  @db.Decimal(15, 2)
  availableLimit Decimal? @db.Decimal(15, 2)
  closingDay    Int?      // Dia do fechamento
  dueDay        Int?      // Dia do vencimento
  
  // Settings
  isActive      Boolean   @default(true)
  isDefault     Boolean   @default(false)
  isVirtual     Boolean   @default(false)
  parentCardId  String?   // Para cartões virtuais
  
  // Open Finance
  openFinanceId String?
  lastSyncAt    DateTime?
  
  // Metadata
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
  
  // Relations
  parentCard    Card?     @relation("VirtualCards", fields: [parentCardId], references: [id])
  virtualCards  Card[]    @relation("VirtualCards")
  transactions  Transaction[]
  bills         CardBill[]
  
  @@unique([userId, name])
  @@index([userId])
  @@map("cards")
}

model CardBill {
  id            String    @id @default(cuid())
  cardId        String
  card          Card      @relation(fields: [cardId], references: [id], onDelete: Cascade)
  
  referenceMonth String   // YYYY-MM
  closingDate   DateTime
  dueDate       DateTime
  
  totalAmount   Decimal   @db.Decimal(15, 2)
  paidAmount    Decimal   @default(0) @db.Decimal(15, 2)
  isPaid        Boolean   @default(false)
  paidAt        DateTime?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  transactions  Transaction[]
  
  @@unique([cardId, referenceMonth])
  @@index([cardId])
  @@index([referenceMonth])
  @@map("card_bills")
}

// ============================================
// CATEGORIES
// ============================================

model Category {
  id            String    @id @default(cuid())
  userId        String?   // Null for system categories
  user          User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String
  slug          String
  type          TransactionType
  icon          String?
  color         String    @default("#757575")
  
  parentId      String?
  parent        Category? @relation("SubCategories", fields: [parentId], references: [id])
  subCategories Category[] @relation("SubCategories")
  
  isSystem      Boolean   @default(false)
  isActive      Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  transactions  Transaction[]
  budgets       Budget[]
  recurringTransactions RecurringTransaction[]
  
  @@unique([userId, slug])
  @@index([userId])
  @@index([parentId])
  @@map("categories")
}

// ============================================
// TRANSACTIONS
// ============================================

model Transaction {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type          TransactionType
  amount        Decimal   @db.Decimal(15, 2)
  description   String
  notes         String?
  
  // Date
  date          DateTime  @db.Date
  paidAt        DateTime?
  
  // Relations
  accountId     String?
  account       Account?  @relation(fields: [accountId], references: [id])
  
  cardId        String?
  card          Card?     @relation(fields: [cardId], references: [id])
  
  cardBillId    String?
  cardBill      CardBill? @relation(fields: [cardBillId], references: [id])
  
  categoryId    String
  category      Category  @relation(fields: [categoryId], references: [id])
  
  // Transfer
  isTransfer    Boolean   @default(false)
  transferFromId String?
  transferFrom  Account?  @relation("TransferFrom", fields: [transferFromId], references: [id])
  transferToId  String?
  transferTo    Account?  @relation("TransferTo", fields: [transferToId], references: [id])
  
  // Recurrence
  isRecurring   Boolean   @default(false)
  recurringId   String?
  recurring     RecurringTransaction? @relation(fields: [recurringId], references: [id])
  
  // Installments
  isInstallment Boolean   @default(false)
  installmentNumber Int?
  installmentTotal Int?
  installmentGroupId String?
  
  // Location
  latitude      Float?
  longitude     Float?
  location      String?
  
  // AI
  aiCategorized Boolean   @default(false)
  aiConfidence  Float?    // 0-1 confidence score
  
  // Metadata
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
  
  // Relations
  attachments   Attachment[]
  tags          Tag[]
  sharedTransaction SharedTransaction?
  importedFrom  ImportedTransaction[]
  
  @@index([userId])
  @@index([date])
  @@index([accountId])
  @@index([cardId])
  @@index([categoryId])
  @@index([recurringId])
  @@index([installmentGroupId])
  @@map("transactions")
}

model RecurringTransaction {
  id            String    @id @default(cuid())
  userId        String
  
  type          TransactionType
  amount        Decimal   @db.Decimal(15, 2)
  description   String
  
  accountId     String?
  account       Account?  @relation(fields: [accountId], references: [id])
  
  categoryId    String
  category      Category  @relation(fields: [categoryId], references: [id])
  
  // Recurrence settings
  recurrenceType RecurrenceType
  recurrenceInterval Int? // For CUSTOM type
  
  startDate     DateTime
  endDate       DateTime?
  nextDate      DateTime?
  
  isActive      Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  transactions  Transaction[]
  
  @@index([userId])
  @@index([nextDate])
  @@map("recurring_transactions")
}

// ============================================
// FAMILY SHARING
// ============================================

model FamilyGroup {
  id            String    @id @default(cuid())
  name          String
  description   String?
  inviteCode    String    @unique @default(cuid())
  
  createdById   String
  createdBy     User      @relation("GroupCreator", fields: [createdById], references: [id])
  
  maxMembers    Int       @default(10)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  members       FamilyMember[]
  sharedTransactions SharedTransaction[]
  
  @@index([inviteCode])
  @@map("family_groups")
}

model FamilyMember {
  id            String    @id @default(cuid())
  
  groupId       String
  group         FamilyGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  status        FamilyMemberStatus @default(ACTIVE)
  
  // Settings
  autoImport    Boolean   @default(false)
  notificationsEnabled Boolean @default(true)
  
  joinedAt      DateTime  @default(now())
  leftAt        DateTime?
  
  @@unique([groupId, userId])
  @@index([groupId])
  @@index([userId])
  @@map("family_members")
}

model SharedTransaction {
  id            String    @id @default(cuid())
  
  transactionId String    @unique
  transaction   Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  
  sharedById    String
  sharedBy      User      @relation("SharedBy", fields: [sharedById], references: [id])
  
  groupId       String
  group         FamilyGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  
  // Split suggestion
  splitType     SplitType @default(EQUAL)
  splitData     Json?     // Stores split configuration
  
  sharedAt      DateTime  @default(now())
  
  imports       ImportedTransaction[]
  
  @@index([groupId])
  @@index([sharedById])
  @@map("shared_transactions")
}

model ImportedTransaction {
  id            String    @id @default(cuid())
  
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  sharedTransactionId String
  sharedTransaction SharedTransaction @relation(fields: [sharedTransactionId], references: [id], onDelete: Cascade)
  
  importedTransactionId String
  importedTransaction Transaction @relation(fields: [importedTransactionId], references: [id], onDelete: Cascade)
  
  importedAmount Decimal  @db.Decimal(15, 2)
  
  importedAt    DateTime  @default(now())
  
  @@unique([userId, sharedTransactionId])
  @@index([userId])
  @@index([sharedTransactionId])
  @@map("imported_transactions")
}

// ============================================
// BUDGETS & GOALS
// ============================================

model Budget {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String
  period        BudgetPeriod
  
  categoryId    String?
  category      Category? @relation(fields: [categoryId], references: [id])
  
  amount        Decimal   @db.Decimal(15, 2)
  spentAmount   Decimal   @default(0) @db.Decimal(15, 2)
  
  startDate     DateTime
  endDate       DateTime
  
  // Alert thresholds
  alertAt50     Boolean   @default(true)
  alertAt75     Boolean   @default(true)
  alertAt90     Boolean   @default(true)
  alertAt100    Boolean   @default(true)
  
  isActive      Boolean   @default(true)
  rollover      Boolean   @default(false) // Carry over unused amount
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@unique([userId, name])
  @@index([userId])
  @@index([categoryId])
  @@map("budgets")
}

model Goal {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String
  description   String?
  icon          String?
  color         String    @default("#4CAF50")
  
  targetAmount  Decimal   @db.Decimal(15, 2)
  currentAmount Decimal   @default(0) @db.Decimal(15, 2)
  
  targetDate    DateTime
  
  status        GoalStatus @default(ACTIVE)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  completedAt   DateTime?
  
  @@index([userId])
  @@map("goals")
}

// ============================================
// ATTACHMENTS & TAGS
// ============================================

model Attachment {
  id            String    @id @default(cuid())
  
  transactionId String
  transaction   Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  
  fileName      String
  fileUrl       String
  fileSize      Int
  mimeType      String
  
  uploadedAt    DateTime  @default(now())
  
  @@index([transactionId])
  @@map("attachments")
}

model Tag {
  id            String    @id @default(cuid())
  name          String    @unique
  slug          String    @unique
  
  transactions  Transaction[]
  
  createdAt     DateTime  @default(now())
  
  @@map("tags")
}

// ============================================
// NOTIFICATIONS
// ============================================

model Notification {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type          NotificationType
  title         String
  message       String
  data          Json?
  
  isRead        Boolean   @default(false)
  readAt        DateTime?
  
  createdAt     DateTime  @default(now())
  
  @@index([userId])
  @@index([isRead])
  @@map("notifications")
}

// ============================================
// DASHBOARD
// ============================================

model DashboardWidget {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  widgetType    String    // 'balance', 'cashflow', 'expenses', 'goals', etc
  position      Int
  config        Json?     // Widget-specific configuration
  
  isVisible     Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@unique([userId, position])
  @@index([userId])
  @@map("dashboard_widgets")
}

// ============================================
// AUDIT & LOGS
// ============================================

model AuditLog {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  action        String    // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc
  entityType    String    // 'transaction', 'account', etc
  entityId      String?
  
  oldData       Json?
  newData       Json?
  
  ipAddress     String?
  userAgent     String?
  
  createdAt     DateTime  @default(now())
  
  @@index([userId])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

// ============================================
// AI & INSIGHTS
// ============================================

model InsightHistory {
  id            String    @id @default(cuid())
  userId        String
  
  insightType   String    // 'spending_pattern', 'saving_opportunity', etc
  title         String
  description   String
  data          Json
  
  confidence    Float     // 0-1 confidence score
  isActionable  Boolean   @default(true)
  wasUseful     Boolean?  // User feedback
  
  createdAt     DateTime  @default(now())
  expiresAt     DateTime
  
  @@index([userId])
  @@index([createdAt])
  @@map("insight_history")
}

model CategoryRule {
  id            String    @id @default(cuid())
  userId        String?   // Null for system rules
  
  pattern       String    // Regex or keyword pattern
  categoryId    String
  
  priority      Int       @default(0)
  isActive      Boolean   @default(true)
  
  matchCount    Int       @default(0)
  accuracy      Float?    // Success rate
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([userId])
  @@index([priority])
  @@map("category_rules")
}