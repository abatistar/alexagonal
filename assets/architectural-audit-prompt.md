# PROMPT DE AUDITORIA ARQUITETURAL - ARQUITETURA HEXAGONAL

## Contexto

Atue como um **Auditor de Qualidade de Código Sênior** (QA Engineer / Software Architect).

Sua tarefa é realizar uma **auditoria estática completa** do projeto atual, comparando a implementação do código com as regras definidas no arquivo `hexagonal-architecture-specification.md`.

---

## Escopo da Análise

Analise os seguintes aspectos do projeto:

1. **Estrutura de pacotes e diretórios** — verificar se segue a taxonomia prescrita
2. **Importações das classes** — detectar dependências proibidas no domínio
3. **Fluxo de dependências** — validar direção unidirecional para o interior do hexágono
4. **Anotações de frameworks** — verificar contaminação do módulo `application/`
5. **Implementação de portas** — validar contratos e nomenclaturas
6. **Configuração de beans** — verificar se está centralizada no módulo `boot/`
7. **Padrões de código** — detectar anti-padrões catalogados

---

## Saída Esperada

Gere um relatório de saída em formato Markdown no caminho:
```
reports/audit-report-{YYYYMMDDHHmm}.md
```

O relatório **DEVE** conter as seguintes seções:

---

### 1. Resumo Executivo

Uma visão geral contendo:
- Data e hora da auditoria
- Versão da especificação utilizada
- Pontuação geral de conformidade
- Classificação de maturidade
- Principais achados (máximo 5 bullet points)

---

### 2. Matriz de Conformidade Detalhada

Para **cada critério da Seção 3 da especificação**, gere uma tabela com as colunas:

| # | Critério | Criticidade | Status | Arquivo(s) Analisado(s) | Evidência |
|---|----------|-------------|--------|-------------------------|-----------|

Onde:
- **Criticidade**: 🔴 Crítico | 🟠 Alto | 🟡 Médio | 🟢 Baixo
- **Status**: ✅ Aprovado | ❌ Reprovado | ⚠️ Parcial | ⏭️ N/A

Agrupe por subseção:
- 3.1. Isolamento do Domínio (8 critérios)
- 3.2. Integridade das Portas (9 critérios)
- 3.3. Conformidade dos Adaptadores (4 critérios)
- 3.4. Direção de Dependências (3 critérios)
- 3.5. Configuração e Injeção (3 critérios)
- 3.6. Conformidade com Spring Framework (8 critérios) — *se aplicável*
- 3.7. Objetos de Transferência - DTOs (5 critérios)
- 3.8. Detecção de Anti-Padrões (4 critérios)

---

### 3. Violações Detectadas

Liste **todas** as violações encontradas, ordenadas por criticidade:

#### 🔴 Violações Críticas (Peso 5)
Para cada violação crítica, detalhe:
- **Critério violado**: # e descrição
- **Localização**: Arquivo, linha, classe/método
- **Evidência**: Trecho de código que comprova a violação
- **Impacto**: Explicação do risco arquitetural

Exemplos de violações críticas:
- "A classe `Order` em `application/domain/` importa `javax.persistence.Entity`"
- "O `OrderController` injeta `OrderRepository` diretamente, ignorando o Use Case"

#### 🟠 Violações de Alta Severidade (Peso 3)
*(mesmo formato)*

#### 🟡 Violações de Média Severidade (Peso 2)
*(mesmo formato)*

#### 🟢 Violações de Baixa Severidade (Peso 1)
*(mesmo formato)*

---

### 4. Recomendações de Refatoração

Para **cada violação**, forneça:

| Violação | Ação Corretiva | Esforço Estimado | Prioridade |
|----------|----------------|------------------|------------|

Onde:
- **Esforço**: Baixo (< 1h) | Médio (1-4h) | Alto (> 4h)
- **Prioridade**: P1 (imediato) | P2 (sprint atual) | P3 (backlog)

Inclua exemplos de código corrigido quando aplicável.

---

### 5. Pontuação de Conformidade Arquitetural

#### 5.1. Metodologia de Cálculo (Ponderada por Criticidade)

Cada critério possui um **peso** baseado em sua criticidade:

| Criticidade | Símbolo | Peso |
|-------------|---------|------|
| CRÍTICO | 🔴 | 5 |
| ALTO | 🟠 | 3 |
| MÉDIO | 🟡 | 2 |
| BAIXO | 🟢 | 1 |

**Fórmula de Pontuação:**
```
Pontuação (%) = (Σ Critérios Aprovados × Peso) / (Σ Total de Critérios × Peso) × 100
```

**Peso Total Máximo:** 146 pontos (distribuídos em 44 critérios)

#### 5.2. Classificação de Conformidade

| Faixa | Classificação | Interpretação | Ação Requerida |
|-------|---------------|---------------|----------------|
| ≥ 90% | ✅ **CONFORME** | Arquitetura sólida | Manutenção contínua |
| 70% - 89% | 🟡 **PARCIALMENTE CONFORME** | Desvios controlados | Plano de ação em 30 dias |
| < 70% | 🔴 **NÃO CONFORME** | Arquitetura comprometida | Intervenção imediata |

#### 5.3. Apresentação do Resultado

Exiba no formato:

```
╔══════════════════════════════════════════════════════════════╗
║           PONTUAÇÃO DE CONFORMIDADE ARQUITETURAL             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Pontuação Ponderada:  XXX / 146 pontos                     ║
║   Percentual:           XX.X%                                ║
║   Classificação:        [CONFORME | PARCIALMENTE | NÃO]      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

#### 5.4. Detalhamento por Categoria

| Categoria | Aprovados | Total | Pontos | Peso Máx | % |
|-----------|-----------|-------|--------|----------|---|
| 3.1. Isolamento do Domínio | X | 8 | XX | 33 | XX% |
| 3.2. Integridade das Portas | X | 9 | XX | 28 | XX% |
| 3.3. Conformidade dos Adaptadores | X | 4 | XX | 16 | XX% |
| 3.4. Direção de Dependências | X | 3 | XX | 13 | XX% |
| 3.5. Configuração e Injeção | X | 3 | XX | 9 | XX% |
| 3.6. Spring Framework | X | 8 | XX | 22 | XX% |
| 3.7. Objetos de Transferência | X | 5 | XX | 7 | XX% |
| 3.8. Anti-Padrões | X | 4 | XX | 18 | XX% |
| **TOTAL** | **X** | **44** | **XXX** | **146** | **XX%** |

#### 5.5. Análise de Risco

Baseado nas violações encontradas, classifique:

| Área de Risco | Nível | Justificativa |
|---------------|-------|---------------|
| Testabilidade | 🟢🟡🔴 | *explicação* |
| Manutenibilidade | 🟢🟡🔴 | *explicação* |
| Substituibilidade de Componentes | 🟢🟡🔴 | *explicação* |
| Isolamento Tecnológico | 🟢🟡🔴 | *explicação* |

---

### 6. Histórico e Tendência

Se existirem relatórios anteriores, inclua:
- Comparativo de pontuação com última auditoria
- Gráfico de evolução (se possível)
- Violações recorrentes

---

## Instruções Finais

1. **NÃO corrija o código** — apenas gere o relatório diagnóstico
2. **Seja objetivo** — baseie-se exclusivamente nas evidências encontradas no código
3. **Priorize clareza** — o relatório será usado por desenvolvedores e gestores
4. **Referencie a especificação** — cite os números dos critérios (ex: "Critério #7")
5. **Documente N/A** — se um critério não se aplica (ex: projeto não usa Spring), marque como N/A e ajuste o peso total

---

## Anexo: Referência Rápida de Pesos

| Seção | Critérios | 🔴 | 🟠 | 🟡 | 🟢 | Peso Total |
|-------|-----------|----|----|----|----|------------|
| 3.1 | #1-8 | 4 | 3 | 1 | 0 | 33 |
| 3.2 | #9-17 | 2 | 4 | 1 | 2 | 28 |
| 3.3 | #18-21 | 2 | 2 | 0 | 0 | 16 |
| 3.4 | #22-24 | 2 | 1 | 0 | 0 | 13 |
| 3.5 | #25-27 | 1 | 1 | 1 | 0 | 9 |
| 3.6 | #28-35 | 1 | 3 | 3 | 1 | 22 |
| 3.7 | #36-40 | 0 | 1 | 0 | 4 | 7 |
| 3.8 | #41-44 | 2 | 1 | 1 | 0 | 18 |
| **Total** | **44** | **14** | **16** | **7** | **7** | **146** |