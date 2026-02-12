# ESPECIFICAÇÃO DE REFERÊNCIA PARA ARQUITETURA HEXAGONAL (PORTS AND ADAPTERS)

**Documento Normativo para Auditoria e Conformidade Arquitetural**

**Versão:** 1.0  
**Última revisão:** 10 de Fevereiro de 2026  
**Classificação:** Documento Técnico Prescritivo  

---

## PREÂMBULO

Esta especificação estabelece os padrões técnicos, estruturais e de conformidade obrigatórios para a implementação da **Arquitetura Hexagonal**, também denominada **Ports and Adapters** (Cockburn, 2005). O presente documento constitui a **fonte autoritativa única** (*Single Source of Truth*) para processos de auditoria de código, revisão arquitetural e validação de conformidade em sistemas que adotem este padrão.

O axioma que demonstra o princípio fundamental que rege a Arquitetura Hexagonal: O Aplicativo deve existir como um núcleo lógico agnóstico e isolado, que define fronteiras de intenção (Portas) para que qualquer tecnologia externa (Atores) seja obrigada a conformar-se à linguagem do domínio através de tradutores (Adaptadores), garantindo que a lógica de negócio nunca toque o mundo real e possa ser testada ou executada em isolamento absoluto.

---

## 1. DEFINIÇÃO E FUNDAMENTOS

### 1.1. Conceituação Formal de "Ports and Adapters"

A Arquitetura Hexagonal define que uma aplicação deve ser construída como um **componente autônomo e tecnologicamente agnóstico**, capaz de operar independentemente de interfaces de usuário, sistemas de persistência, redes ou quaisquer dispositivos de entrada/saída. O objetivo primário é garantir que o sistema possa ser **conduzido igualmente** por:

- Usuários humanos através de interfaces gráficas (GUI);
- Programas externos via chamadas de API;
- Suítes de testes automatizados de regressão;
- Scripts de processamento em lote (*batch*).

A denominação "Hexagonal" é **simbólica e não-matemática**. Alistair Cockburn adotou deliberadamente a forma hexagonal para:

1. **Eliminar a percepção hierárquica** inerente a diagramas de camadas tradicionais (superior/inferior, esquerda/direita);
2. **Prover espaço visual suficiente** para representar múltiplas facetas de interação sem sugerir ordenação ou precedência.

O hexágono representa, portanto, uma **fronteira conceitual** que delimita o domínio da aplicação, onde cada aresta simboliza uma categoria distinta de interação com o mundo externo.

### 1.2. A Regra de Dependência (Dependency Rule)

O axioma fundamental da arquitetura prescreve que **o interior não deve possuir conhecimento do exterior**. Esta regra estabelece as seguintes invariantes:

| Componente | Conhecimento Permitido | Conhecimento Proibido |
|------------|------------------------|-----------------------|
| Núcleo/Domínio | Regras de negócio, Entidades, Value Objects | Frameworks, Bibliotecas externas, Tecnologias de I/O |
| Portas | Contratos abstratos de interação | Implementações concretas de adaptadores |
| Adaptadores | Portas, Tecnologias específicas | Estrutura interna do domínio além das portas |

**Corolário Mandatório:** Toda dependência de código-fonte deve apontar **unidirecionalmente para o interior** do hexágono. Nenhum módulo interno pode importar, referenciar ou instanciar diretamente classes ou interfaces definidas em módulos externos (infraestrutura).

**Implicação Prática:** O núcleo da aplicação deve ser compilável e executável sem a presença de qualquer adaptador concreto no *classpath*, utilizando exclusivamente dublês de teste (*mocks*, *stubs*, *fakes*).

### 1.3. Inversão de Controle e o Padrão de Dependência Configurável

#### 1.3.1. O Princípio de Inversão de Dependência (DIP)

Conforme formulação de Robert C. Martin, o princípio estabelece:

> *"Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações. Abstrações não devem depender de detalhes. Detalhes devem depender de abstrações."*

Na Arquitetura Hexagonal, este princípio manifesta-se na seguinte forma: **o aplicativo (módulo de alto nível) define e possui as interfaces (portas)** que descrevem suas necessidades; os adaptadores (módulos de baixo nível) implementam estas interfaces, invertendo a direção convencional de dependência.

#### 1.3.2. Dependência Configurável (Configurable Dependency)

Alistair Cockburn expressa preferência terminológica pelo termo **"Dependência Configurável"** em detrimento de "Inversão de Controle" (IoC) ou "Injeção de Dependência" (DI), fundamentando:

- **IoC** constitui um "duplo negativo" que implica correção de erro prévio;
- **DI** descreve uma ação mecânica, não uma propriedade arquitetural.

**Dependência Configurável** descreve a **propriedade positiva desejada**: a capacidade de configurar externamente qual implementação concreta será utilizada para satisfazer uma interface abstrata, permitindo substituição de componentes sem modificação do código da aplicação.

**Nota Terminológica (2023):** Em revisões posteriores, o padrão foi renomeado para **"Receptor Configurável"** (*Configurable Receiver*), considerado sucessor mais preciso do conceito.

#### 1.3.3. Assimetria de Implementação

Embora o padrão seja **conceitualmente simétrico** quanto ao isolamento tecnológico, existe uma **assimetria fundamental de implementação**:

| Lado | Tipo de Ator | Direção da Dependência | Quem Conhece Quem |
|------|--------------|------------------------|-------------------|
| **Primário (Driver)** | Condutor | Natural | O ator externo conhece a API do aplicativo |
| **Secundário (Driven)** | Conduzido | Invertida (DIP obrigatório) | O aplicativo conhece apenas a interface abstrata (porta); desconhece a implementação |

**Implicação Técnica:** No lado conduzido, a Inversão de Dependência é **mandatória e não-negociável**. O aplicativo define a porta (SPI — *Service Provider Interface*), e o ator externo deve adaptar-se a ela.

---

## 2. ELEMENTOS ESTRUTURAIS (TAXONOMIA FORMAL)

### 2.1. Definições Técnicas Normativas

#### 2.1.1. O Aplicativo (Núcleo / Hexágono)

**Definição:** O aplicativo representa o **núcleo da lógica de negócios** e constitui um componente que:

- **DEVE** ser totalmente agnóstico em relação à tecnologia;
- **DEVE** definir explicitamente quais serviços oferece (interfaces fornecidas — API);
- **DEVE** definir explicitamente quais serviços necessita (interfaces requeridas — SPI);
- **NÃO DEVE** conter referências a bancos de dados, interfaces de usuário, protocolos de rede ou dispositivos físicos;
- **NÃO DEVE** ser contaminado por detalhes técnicos de entrada/saída (I/O);

**Observação Normativa:** A Arquitetura Hexagonal **não prescreve a organização interna do hexágono**. O interior é tratado como caixa-preta, sendo o desenvolvedor livre para empregar Domain-Driven Design (DDD), arquitetura em camadas, paradigma funcional, procedural ou qualquer outra abordagem, desde que os limites das portas sejam estritamente respeitados.

#### 2.1.2. Entidades de Domínio

**Definição:** Objetos de negócio que encapsulam regras e lógica essenciais do domínio, **desprovidos de conhecimento sobre persistência ou mecanismos de transporte**.

- **DEVE** representar conceitos fundamentais do domínio de negócio;
- **DEVE** conter lógica de validação intrínseca ao conceito que representam;
- **DEVE** ser independente de ciclo de vida de requisição ou sessão;
- **NÃO DEVE** utilizar padrões que acoplam a persistência;

#### 2.1.3. Casos de Uso (Application Services)

**Definição:** Unidades de orquestração que implementam fluxos de negócio específicos, coordenando Entidades de Domínio e interações com Portas de Saída.

- **DEVE** fornecer a implementação concreta da interface definida por ***Portas de Entrada***;
- **DEVE** orquestrar operações sobre ***Entidades de Domínio***;
- **DEVE** invocar ***Portas de Saída*** quando dados externos são necessários;
- **DEVE** compor e retornar respostas através da interface definida por ***Portas de Entrada***;
- **NÃO DEVE** conter lógica de I/O direta (SQL, HTTP, manipulação de arquivos);
- **NÃO DEVE** conhecer detalhes de implementação dos adaptadores;

#### 2.1.4. Portas de Entrada (Input Ports / Driver Ports / Portas Primárias)

**Definição:** Interfaces fornecidas pelo aplicativo que definem os serviços oferecidos ao mundo externo. Representam o **protocolo que a aplicação está disposta a honrar** para atores que iniciam interações.

- **DEVE** ser chamada por ***Atores Primários (Condutores)***;
- **DEVE** definir contrato para operações de negócio disponíveis;
- **DEVE** utilizar tipos de dados neutros em relação à tecnologia;
- **DEVE** utilizar a ***Convenção de Nomenclatura Obrigatória***;

**Convenção de Nomenclatura Obrigatória**: As ***Portas de Entrada*** devem ser nomeadas utilizando a estratégia de "Role Interface" (Substantivos de Papel) que descrevam a capacidade de negócio, onde o nome define o papel que a aplicação desempenha para quem a chama. Usa verbos substantivados ou nomes funcionais.

- OrderPlacer (ou EmissorDePedidos)
- StockChecker (ou VerificadorDeEstoque)
- NotificationSender (ou EmissorDeNotificacoes) - **Cuidado**: isso geralmente é porta de saída, mas pode ser entrada se sua aplicação FOR o sistema de notificação.

**Observação IMPORTANTE!** ***Portas de Entrada*** definem uma ***interface***, tal interface é conceitual, podendo ser descrita através da implementação concreta do ***Caso de Uso***.

#### 2.1.5. Portas de Saída (Output Ports / Driven Ports / Portas Secundárias)

**Definição:** Interfaces necessárias definidas pelo aplicativo (SPI — *Service Provider Interface*) que descrevem os serviços requeridos de entidades externas para que a aplicação funcione.

- **DEVE** representar dependências que a aplicação exige do mundo externo;
- **DEVE** exclusivamente fornecer as interfaces para que os sistemas externos se adaptem a estas;
- **DEVE** o ***Aplicativo*** ser o proprietário destas definições;
- **DEVE** utilizar a ***Convenção de Nomenclatura Obrigatória***;

**Convenção de Nomenclatura Obrigatória**: As ***Portas de Saída*** devem ser nomeadas utilizando a seguinte convenção.

- Para uma requisição de Serviço (API Externa), usar o sufixo *'Gateway'*.
- Para uma requisição de Repositório (Arquivo, Banco), usar o sufixo *'Repository'*.
- Para uma requisição de Processamento Assíncrono (Filas/Tópicos), usar o sufixo *'Broker'*.

**Categorias Típicas:**
- Integrações externas (`FreightGateway`);
- Repositórios de dados (`OrderRepository`);
- Processamento assíncrono (`MessageBroker`).

**Observação IMPORTANTE!** Nem toda interface é uma porta. Uma porta é especificamente um **ponto de interação que permite a substituição deliberada de tecnologias** ou a utilização de dublês de teste.

#### 2.1.6. Adaptadores (Adapters)

**Definição:** Componentes de código **externos ao hexágono** responsáveis por traduzir solicitações entre o protocolo tecnologicamente neutro das portas e sinais específicos de tecnologias do mundo real.

##### 2.1.6.1. Adaptadores de Condução (Driving Adapters / Adaptadores Primários)

Convertem sinais de tecnologias específicas em chamadas para as Portas de Entrada do aplicativo.

| Tecnologia de Origem | Função do Adaptador |
|----------------------|---------------------|
| Interface Gráfica (GUI) | Traduz eventos de usuário (cliques, inputs) em chamadas de API |
| API REST | Converte requisições HTTP em invocações de Casos de Uso |
| CLI (Command Line) | Transforma argumentos de linha de comando em operações |
| Mensageria (MQ) | Deserializa mensagens e aciona fluxos de negócio |
| Testes Automatizados | Invoca portas diretamente para verificação de comportamento |

##### 2.1.6.2. Adaptadores Conduzidos (Driven Adapters / Adaptadores Secundários)

Implementam as interfaces definidas pelas Portas de Saída utilizando tecnologias reais.

| Porta de Saída | Papel (Role) | Implementações Possíveis (Adaptadores) |
|----------------|--------------|----------------------------------------|
| OrderRepository | Coleção de pedidos | PostgresOrderRepository<br/>MongoOrderAdapter<br/>InMemoryOrderFake |
| QuoteGateway | Portal de acesso a cotações | RestQuoteClient<br/>SoapQuoteService<br/>FixedRateStub |
| UserBroker | Emissor de mensagens | SmtpEmailAdapter<br/>TwilioSmsClient<br/>ConsoleLogger |

**Observação sobre Dublês de Teste:** *Mocks*, *stubs* e *fakes* são considerados **adaptadores fundamentais** da arquitetura, pois viabilizam a execução da aplicação em modo isolado para verificações de regressão.

#### 2.1.7. O Configurador (5º Elemento)

**Definição:** Componente responsável pela instanciação e conexão (*wiring*) de todas as peças do sistema. Embora tecnicamente **externo ao padrão Ports & Adapters**, é **indispensável** para a operacionalização.

**Manifestações Típicas:**
- Método `main()` da aplicação;
- Classe de configuração de framework (ex: `@Configuration` no Spring);
- Fábrica de composição (*Composition Root*).

**Característica Distintiva:** O Configurador é o único componente com visão ampla do sistema — ele possui conhecimento de todas as implementações concretas e é responsável por conectá-las.

### 2.2. Estrutura de Pacotes e Diretórios

A organização física do código-fonte **DEVE** refletir os limites arquiteturais estabelecidos. A seguinte taxonomia de diretórios é **prescrita**:

```
src/
├── application/                          # O HEXÁGONO (Núcleo)
│   ├── / (raiz)                          # Casos de Uso (Portas de Entrada)
│   │   ├── order/
│   │   │   ├── CreateOrder.java
│   │   │   └── ListOrder.java
│   │   └── client/
│   ├── domain/                           # Entidades e Value Objects
│   │   ├── entities/
│   │   ├── valueobjects/
│   │   └── exceptions/
│   └── services/                         # Portas de Saída (SPI)
│       ├── OrderRepository.java
│       └── ReportingGateway.java
|
├── adapters/
│   ├── in/                               # Adaptadores de Entrada (Condução)
│   │   ├── rest/
│   │   │   └── OrderController.java
│   │   └── soap/
│   └── out/                              # Adaptadores de Saída (Conduzidos)
│       ├── persistence/
│       │   ├── OrderRepository.java
│       ├── notification/
│       │   └── SmtpNotification.java
│       └── external/
│           └── CatalogReporting.java
|
├── boot/                                 # O Configurador
│       └── ApplicationConfig.java
|
├── shared/                               # Compartilhados
│       └── Constants.java
│
└── test/
    ├── unit/                             # Testes com Mocks/Stubs
    ├── integration/                      # Testes com Adaptadores Reais
    └── adapters/                         # Dublês de Teste como Adaptadores
        └── FakeOrderRepository.java
```

**Regras de Dependência entre Pacotes:**

| Pacote Origem | Pode Depender De | NÃO Pode Depender De |
|---------------|------------------|----------------------|
| `application/domain` | Nada externo | `application`, `application/ports`, `adapters` |
| `application` | `application/domain`, `application/services` | `adapters` |
| `application/services` | `application/domain` (tipos de retorno) | `adapters` |
| `adapters` | `application`, `application/services`, frameworks/bibliotecas | — |
| `boot` | Tudo (é o *Composition Root*) | — |

---

## 3. CRITÉRIOS DE CONFORMIDADE (CHECKLIST PARA AUDITORIA)

O código-fonte **DEVE** ser validado contra as seguintes regras binárias. Cada item representa uma invariante arquitetural cuja violação constitui **não-conformidade**.

### 3.0. Níveis de Criticidade

Cada critério possui um nível de criticidade que determina seu peso na avaliação de conformidade:

| Nível | Símbolo | Peso | Descrição | Impacto da Violação |
|-------|---------|------|-----------|---------------------|
| **CRÍTICO** | 🔴 | 5 | Violação fundamental | Invalida a arquitetura hexagonal; requer correção imediata |
| **ALTO** | 🟠 | 3 | Violação grave | Compromete princípios essenciais; alto risco técnico |
| **MÉDIO** | 🟡 | 2 | Violação moderada | Afeta qualidade arquitetural; débito técnico significativo |
| **BAIXO** | 🟢 | 1 | Violação menor | Impacto em convenções e padronização; baixo risco |

**Fórmula de Pontuação:**
```
Pontuação = (Σ Critérios Conformes × Peso) / (Σ Total de Critérios × Peso) × 100
```

**Classificação de Conformidade:**
- **≥ 90%**: Conforme
- **70% - 89%**: Parcialmente Conforme (requer plano de ação)
- **< 70%**: Não Conforme (requer intervenção imediata)

### 3.1. Isolamento do Domínio

| # | Critério de Auditoria | Resposta Esperada | Criticidade |
|---|-----------------------|-------------------|-------------|
| 1 | O módulo de domínio (`application/domain`) importa bibliotecas de frameworks (Spring, Jakarta EE, Hibernate)? | **NÃO** | 🔴 CRÍTICO |
| 2 | O módulo de domínio importa bibliotecas de I/O (JDBC, HTTP clients, File I/O)? | **NÃO** | 🔴 CRÍTICO |
| 3 | O módulo de domínio importa classes externas ao módulo de domínio? | **NÃO** | 🟠 ALTO |
| 4 | As Entidades de Domínio representam conceitos fundamentais do domínio de negócio? | **SIM** | 🟠 ALTO |
| 5 | As Entidades de Domínio contêm lógica de validação intrínseca ao conceito que representam? | **SIM** | 🟡 MÉDIO |
| 6 | As Entidades de Domínio são independentes do ciclo de vida da requisição ou sessão? | **SIM** | 🟠 ALTO |
| 7 | As Entidades de Domínio utilizam anotações de persistência (ex: `@Entity`, `@Table`, `@Column`)? | **NÃO** | 🔴 CRÍTICO |
| 8 | As Entidades de Domínio implementam o padrão Active Record (métodos `save()`, `delete()` próprios)? | **NÃO** | 🔴 CRÍTICO |

### 3.2. Integridade das Portas

| # | Critério de Auditoria | Resposta Esperada | Criticidade |
|---|-----------------------|-------------------|-------------|
| 9 | As Portas de Entrada definem contratos para operações de negócio disponíveis? | **SIM** | 🟠 ALTO |
| 10 | As Portas de Entrada são exclusivamente chamadas por Atores Primários (Condutores)? | **SIM** | 🟠 ALTO |
| 11 | As Portas de Entrada utilizam tipos de dados neutros em relação à tecnologia? | **SIM** | 🔴 CRÍTICO |
| 12 | As Portas de Entrada utilizam a Convenção de Nomenclatura Obrigatória? | **SIM** | 🟢 BAIXO |
| 13 | As Portas de Entrada expõem operações de granularidade adequada ao caso de uso (não CRUD genérico)? | **SIM** | 🟡 MÉDIO |
| 14 | As Portas de Saída são definidas como interfaces dentro do módulo `application/services`? | **SIM** | 🟠 ALTO |
| 15 | As Portas de Saída têm assinaturas que utilizam exclusivamente tipos neutros (sem `HttpRequest`, `ResultSet`, `JsonNode`)? | **SIM** | 🔴 CRÍTICO |
| 16 | As Portas de Saída fornecem interfaces para que os sistemas externos se adaptem a estas? | **SIM** | 🟠 ALTO |
| 17 | As Portas de Saída utilizam a Convenção de Nomenclatura Obrigatória? | **SIM** | 🟢 BAIXO |

### 3.3. Conformidade dos Adaptadores

| # | Critério de Auditoria | Resposta Esperada | Criticidade |
|---|-----------------------|-------------------|-------------|
| 18 | Os Adaptadores de Condução dependem exclusivamente de Portas de Entrada para requisições ao Aplicativo? | **SIM** | 🔴 CRÍTICO |
| 19 | Os Adaptadores Conduzidos implementam interfaces definidas como Portas de Saída? | **SIM** | 🔴 CRÍTICO |
| 20 | Os Adaptadores de Condução estão fisicamente no módulo `adapters/in` (fora do hexágono)? | **SIM** | 🟠 ALTO |
| 21 | Os Adaptadores Conduzidos estão fisicamente no módulo `adapters/out` (fora do hexágono)? | **SIM** | 🟠 ALTO |

### 3.4. Direção de Dependências

| # | Critério de Auditoria | Resposta Esperada | Criticidade |
|---|-----------------------|-------------------|-------------|
| 22 | Todas as dependências de código-fonte apontam unidirecionalmente para o interior do hexágono? | **SIM** | 🔴 CRÍTICO |
| 23 | O módulo `application` pode ser compilado isoladamente no classpath? | **SIM** | 🔴 CRÍTICO |
| 24 | A aplicação pode ser executada em modo "headless" (sem UI real) utilizando apenas testes automatizados? | **SIM** | 🟠 ALTO |

### 3.5. Configuração e Injeção

| # | Critério de Auditoria | Resposta Esperada | Criticidade |
|---|----------------------|-------------------|-------------|
| 25 | O Configurador (Composition Root) reside no módulo `boot`? | **SIM** | 🟠 ALTO |
| 26 | Os Casos de Uso recebem as Portas de Saída via injeção de construtor (não instanciam diretamente)? | **SIM** | 🔴 CRÍTICO |
| 27 | Os testes de unidade injetam dublês (*mocks*, *stubs*, *fakes*) nas Portas de Saída? | **SIM** | 🟡 MÉDIO |

### 3.6. Conformidade com Spring Framework

Quando utilizando Spring Framework, os seguintes critérios adicionais **DEVEM** ser verificados:

| # | Critério de Auditoria | Resposta Esperada | Criticidade |
|---|-----------------------|-------------------|-------------|
| 28 | O módulo `application/` está livre de anotações Spring (`@Service`, `@Component`, `@Autowired`)? | **SIM** | 🔴 CRÍTICO |
| 29 | Todos os beans (Use Cases e Adapters) são configurados exclusivamente via `@Configuration` no módulo `boot/`? | **SIM** | 🟠 ALTO |
| 30 | As dependências são injetadas via construtor (sem `@Autowired` em campos ou setters)? | **SIM** | 🟡 MÉDIO |
| 31 | Os Adaptadores Secundários (`adapters/out/`) são classes Java puras, configuradas via `@Bean`? | **SIM** | 🟠 ALTO |
| 32 | Apenas Adaptadores Primários (`adapters/in/`) utilizam anotações como `@RestController`, `@MessageListener`? | **SIM** | 🟠 ALTO |
| 33 | A inicialização de componentes é feita exclusivamente via construtor (sem `@PostConstruct`)? | **SIM** | 🟡 MÉDIO |
| 34 | Diferentes ambientes (produção, homologação, teste) utilizam `@Profile` para alternar implementações? | **SIM** | 🟢 BAIXO |
| 35 | Cada Output Port possui exatamente uma implementação ativa por `@Profile`? | **SIM** | 🟡 MÉDIO |

### 3.7. Objetos de Transferência (DTOs)

| # | Critério de Auditoria | Resposta Esperada | Criticidade |
|---|-----------------------|-------------------|-------------|
| 36 | A comunicação através das fronteiras arquiteturais utiliza DTOs distintos dos objetos de domínio? | **SIM** | 🟠 ALTO |
| 37 | Os Commands seguem a convenção de nomenclatura `<Verbo><Substantivo>Command`? | **SIM** | 🟢 BAIXO |
| 38 | As Queries seguem a convenção de nomenclatura `<Substantivo>Query` ou `Get<Substantivo>Query`? | **SIM** | 🟢 BAIXO |
| 39 | Os Response DTOs seguem a convenção de nomenclatura `<Substantivo>Response` ou `<Substantivo>Result`? | **SIM** | 🟢 BAIXO |
| 40 | Os modelos de persistência seguem a convenção `<Substantivo>Entity` ou `<Substantivo>Document`? | **SIM** | 🟢 BAIXO |

### 3.8. Detecção de Anti-Padrões

| # | Critério de Auditoria | Resposta Esperada | Criticidade |
|---|-----------------------|-------------------|-------------|
| 41 | As Entidades de Domínio possuem mais setters públicos que métodos de negócio? | **NÃO** | 🟠 ALTO |
| 42 | Os Casos de Uso possuem mais de 5 métodos públicos? | **NÃO** | 🟡 MÉDIO |
| 43 | Os Adaptadores Primários injetam Repositories ou Gateways diretamente (bypass do Use Case)? | **NÃO** | 🔴 CRÍTICO |
| 44 | O módulo de Casos de Uso (`application/`) contém lógica de I/O direta (SQL, HTTP, File I/O)? | **NÃO** | 🔴 CRÍTICO |

### 3.9. Resumo de Criticidade

| Nível | Quantidade | Peso Total |
|-------|------------|------------|
| 🔴 CRÍTICO | 16 | 80 |
| 🟠 ALTO | 16 | 48 |
| 🟡 MÉDIO | 6 | 12 |
| 🟢 BAIXO | 6 | 6 |
| **TOTAL** | **44** | **146** |

---

## 4. DIRETRIZES DE IMPLEMENTAÇÃO

### 4.1. DTOs versus Objetos de Domínio

#### 4.1.1. Princípio da Separação de Representações

A comunicação através das fronteiras arquiteturais **DEVE** utilizar objetos de transferência distintos dos objetos de domínio. Esta separação garante:

1. **Encapsulamento:** Detalhes internos do domínio não vazam para camadas externas;
2. **Estabilidade:** Mudanças no domínio não propagam automaticamente para contratos de API;
3. **Flexibilidade:** Representações podem ser otimizadas para cada contexto de uso;

#### 4.1.2. Fluxo de Dados Prescrito

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE ENTRADA (REQUEST)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [Tecnologia Externa]                                                      │
│   (JSON/XML/Form)                                                           │
│              │                                                              │
│              ▼                                                              │
│   [Adaptador Primário]                                                      │
│   (Deserialização → Command/Query DTO)                                      │
│              │                                                              │
│              ▼                                                              │
│   [Caso de Uso] ◄── implementa ── [Porta de Entrada]                        │
│   (Recebe Command/Query DTO)                                                │
│              │                                                              │
│              ▼                                                              │
│   [Conversão Command/Query DTO → Entidade de Domínio]                       │
│   (Dentro do Caso de Uso)                                                   │
│              │                                                              │
│              ▼                                                              │
│   [Lógica de Negócio com Entidades de Domínio]                              │
│              │                                                              │
│              ▼                                                              │
│   [Porta de Saída] ◄── interface definida pelo aplicativo                   │
│   (Recebe Objetos de Domínio ou tipos especializados)                       │
│              │                                                              │
│              ▼                                                              │
│   [Adaptador Secundário]                                                    │
│   (Conversão Domínio → Modelo de Persistência/API Externa)                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE SAÍDA (RESPONSE)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [Adaptador Secundário]                                                    │
│   (Retorna dados ou confirma operação)                                      │
│              │                                                              │
│              ▼                                                              │
│   [Porta de Saída]                                                          │
│   (Retorna Objetos de Domínio ou tipos especializados)                      │
│              │                                                              │
│              ▼                                                              │
│   [Caso de Uso]                                                             │
│   (Processa resultado, aplica regras adicionais)                            │
│              │                                                              │
│              ▼                                                              │
│   [Conversão Domínio → Response DTO]                                        │
│   (Dentro do Caso de Uso)                                                   │
│              │                                                              │
│              ▼                                                              │
│   [Porta de Entrada]                                                        │
│   (Retorna Response DTO)                                                    │
│              │                                                              │
│              ▼                                                              │
│   [Adaptador Primário]                                                      │
│   (Serialização → JSON/XML + Status HTTP)                                   │
│              │                                                              │
│              ▼                                                              │
│   [Tecnologia Externa]                                                      │
│   (Resposta ao cliente)                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 4.1.3. Localização dos Mapeamentos

| Fronteira | Responsável pelo Mapeamento | Direção | Exemplo |
|-----------|----------------------------|---------|----------|
| Tecnologia → Adaptador Primário | Adaptador Primário | JSON/HTTP → Command DTO | `@RequestBody` → `CreateOrderCommand` |
| Adaptador Primário → Caso de Uso | Caso de Uso (Porta de Entrada) | Command DTO → Entidade de Domínio | `CreateOrderCommand` → `Order` |
| Caso de Uso → Porta de Saída | Caso de Uso | Entidade de Domínio → Contrato da Porta | `Order` → parâmetro de `save(Order)` |
| Porta de Saída → Adaptador Secundário | Adaptador Secundário | Entidade de Domínio → Modelo de Persistência | `Order` → `OrderEntity` |
| Adaptador Secundário → Porta de Saída | Adaptador Secundário | Modelo de Persistência → Entidade de Domínio | `OrderEntity` → `Order` |
| Caso de Uso → Adaptador Primário | Caso de Uso | Entidade de Domínio → Response DTO | `Order` → `CreateOrderResponse` |
| Adaptador Primário → Tecnologia | Adaptador Primário | Response DTO → JSON/HTTP | `CreateOrderResponse` → `ResponseEntity` |

**Observação IMPORTANTE!** O Caso de Uso é a implementação concreta da Porta de Entrada. Não há "passagem" entre eles — são o mesmo componente. A Porta de Entrada define o contrato (interface); o Caso de Uso o implementa.

#### 4.1.4. Tipos de Objetos de Transferência

| Tipo | Propósito | Convenção de Nome |
|------|-----------|-------------------|
| **Command** | Encapsula dados para operações que **alteram estado** | `<Verbo><Substantivo>Command` |
| **Query** | Encapsula dados para operações de **consulta** (somente leitura) | `<Substantivo>Query` ou `Get<Substantivo>Query` |
| **Response DTO** | Encapsula dados de retorno de operações | `<Substantivo>Response` ou `<Substantivo>Result` |
| **Persistence Model** | Representa estrutura de armazenamento (ex: entidade JPA) | `<Substantivo>Entity` ou `<Substantivo>Document` |
| **External API Model** | Representa contratos de APIs externas | `<Substantivo>ApiRequest/Response` |

##### 4.1.4.1. Exemplos de Commands e Queries

```java
// COMMANDS (write operations)
public record CreateOrderCommand(
    String customerId,
    List<OrderItemCommand> items,
    String deliveryAddress
) {}

public record CancelOrderCommand(
    String orderId,
    String reason
) {}

// QUERIES (read operations)
public record GetOrderByIdQuery(
    String orderId
) {}

public record ListOrdersByCustomerQuery(
    String customerId,
    LocalDate startDate,
    LocalDate endDate,
    int page,
    int pageSize
) {}

// RESPONSES
public record OrderCreatedResponse(
    String orderId,
    String status,
    LocalDateTime createdAt,
    BigDecimal totalAmount
) {}
```

##### 4.1.4.2. Princípio CQS (Command-Query Separation)

| Tipo | Altera Estado? | Retorna Dados? | Idempotente? |
|------|----------------|----------------|---------------|
| **Command** | **SIM** | Mínimo (ID, status) | Geralmente NÃO |
| **Query** | **NÃO** | **SIM** | **SIM** |

### 4.2. Configuração e Injeção de Dependência

#### 4.2.1. Sequência de Instanciação Mandatória

O Configurador **DEVE** seguir rigorosamente a seguinte ordem de instanciação:

```
STEP 1: Instantiate Driven Adapters (Secondary)
         ├── SqlOrderRepository
         ├── SmtpNotificationService
         └── ExternalApiClient

              │
              ▼

STEP 2: Instantiate the Application (Core)
         └── Pass secondary adapters via constructor
             as Output Port implementations

              │
              ▼

STEP 3: Instantiate Driving Adapters (Primary)
         ├── OrderRestController
         └── MessageQueueProcessor
             └── Deliver application instance to them

              │
              ▼

STEP 4: Start Execution
         └── Primary adapters await external interactions
```

**Observação sobre Frameworks de Injeção de Dependência:**

Quando utilizando frameworks como **Spring**, **Quarkus** ou **Micronaut**, a sequência acima é gerenciada automaticamente pelo container IoC. O desenvolvedor **DEVE** garantir que:

1. A ordem de dependências esteja corretamente declarada via anotações ou configuração;
2. O framework resolva as dependências na ordem correta automaticamente;
3. Não haja dependências circulares entre componentes.

##### 4.2.1.1. Exemplo de Composição com Spring Framework

Com Spring, a sequência de instanciação é gerenciada pelo container IoC.

**IMPORTANTE!** A camada de aplicação (`application/`) **NÃO DEVE** conter nenhuma anotação Spring (`@Service`, `@Component`, etc.). Toda configuração de beans deve ser feita exclusivamente através de classes `@Configuration` no módulo `boot/`.

```java
// ═══════════════════════════════════════════════════════════════════════════
// LAYER: application/ (HEXAGON - PURE JAVA, NO SPRING ANNOTATIONS)
// ═══════════════════════════════════════════════════════════════════════════

// Use Case - Pure Java class, NO Spring annotations
public class CreateOrder {
    
    // Dependencies are FINAL and injected via constructor
    private final OrderRepository repository;
    private final NotificationSender notifier;
    private final RateProvider rateProvider;
    
    public CreateOrder(
            OrderRepository repository,
            NotificationSender notifier,
            RateProvider rateProvider) {
        this.repository = repository;
        this.notifier = notifier;
        this.rateProvider = rateProvider;
    }
    
    public OrderCreatedResponse create(CreateOrderCommand command) {
        // 1. Convert Command → Domain Entity
        Order order = Order.create(
            command.customerId(),
            command.items(),
            command.deliveryAddress()
        );
        
        // 2. Apply business rules
        BigDecimal rate = rateProvider.getCurrentRate();
        order.applyRate(rate);
        
        // 3. Persist via Output Port
        repository.save(order);
        
        // 4. Notify via Output Port
        notifier.sendConfirmation(order.getCustomerId(), order.getId());
        
        // 5. Convert Domain → Response DTO
        return new OrderCreatedResponse(
            order.getId(),
            order.getStatus().name(),
            order.getCreatedAt(),
            order.getTotalAmount()
        );
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYER: adapters/out/ (Secondary Adapters - Pure Java, configured externally)
// ═══════════════════════════════════════════════════════════════════════════

// Secondary Adapter - Pure Java class, NO Spring annotations
public class SqlOrderAdapter implements OrderRepository {
    
    private final JdbcTemplate jdbcTemplate;
    
    public SqlOrderAdapter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    @Override
    public void save(Order order) { /* ... */ }
    
    @Override
    public Optional<Order> findById(String id) { /* ... */ }
}

// Secondary Adapter - Pure Java class
public class SmtpNotificationAdapter implements NotificationSender {
    
    private final JavaMailSender mailSender;
    
    public SmtpNotificationAdapter(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    @Override
    public void sendConfirmation(String customerId, String orderId) { /* ... */ }
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYER: adapters/in/ (Primary Adapters - Can have framework annotations)
// ═══════════════════════════════════════════════════════════════════════════

// Primary Adapter - May use framework annotations (external to hexagon)
@RestController
@RequestMapping("/api/orders")
public class OrderRestController {
    
    private final CreateOrder orderPlacer;  // Input Port
    
    public OrderRestController(CreateOrder orderPlacer) {
        this.orderPlacer = orderPlacer;
    }
    
    @PostMapping
    public ResponseEntity<OrderCreatedResponse> create(@RequestBody CreateOrderRequest request) {
        CreateOrderCommand command = mapToCommand(request);
        OrderCreatedResponse response = orderPlacer.create(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYER: boot/ (Configuration - ALL bean definitions here)
// ═══════════════════════════════════════════════════════════════════════════

@Configuration
public class AdaptersConfig {
    
    // Secondary Adapters beans
    @Bean
    public OrderRepository orderRepository(JdbcTemplate jdbcTemplate) {
        return new SqlOrderAdapter(jdbcTemplate);
    }
    
    @Bean
    public NotificationSender notificationSender(JavaMailSender mailSender) {
        return new SmtpNotificationAdapter(mailSender);
    }
    
    @Bean
    public RateProvider rateProvider(RestTemplate restTemplate) {
        return new RestRateAdapter(restTemplate);
    }
}

@Configuration
public class UseCasesConfig {
    
    // Use Cases beans - configured here, NOT via @Service
    @Bean
    public CreateOrder orderPlacer(
            OrderRepository repository,
            NotificationSender notifier,
            RateProvider rateProvider) {
        return new CreateOrder(repository, notifier, rateProvider);
    }
}

@SpringBootApplication
@ComponentScan(basePackages = {
    "com.example.boot",          // Configuration classes
    "com.example.adapters.in"    // Only Primary Adapters with @RestController
})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

##### 4.2.1.2. Múltiplas Implementações com @Profile

Quando há múltiplas implementações de uma porta (produção, teste, homologação), utilize `@Profile` para alternar entre elas:

```java
// ═══════════════════════════════════════════════════════════════════════════
// LAYER: boot/ - Configuration for different environments
// ═══════════════════════════════════════════════════════════════════════════

@Configuration
public class RepositoryConfig {
    
    @Bean
    @Profile("production")
    public OrderRepository productionOrderRepository(DataSource dataSource) {
        return new SqlOrderAdapter(new JdbcTemplate(dataSource));
    }
    
    @Bean
    @Profile("homolog")
    public OrderRepository homologOrderRepository(DataSource dataSource) {
        // Same implementation, different datasource configured per environment
        return new SqlOrderAdapter(new JdbcTemplate(dataSource));
    }
    
    @Bean
    @Profile("test")
    public OrderRepository testOrderRepository() {
        return new InMemoryOrderRepository();
    }
}

@Configuration
public class UseCasesConfig {
    
    @Bean
    public CreateOrder orderPlacer(OrderRepository repository, NotificationSender notifier, TransactionTemplate transactionTemplate) {
        
        // Pure use case (no Spring dependency)
        CreateOrder useCase = new CreateOrder(repository, notifier);
        
        // Decorated with transaction management (infrastructure concern)
        return new TransactionalCreateOrder(useCase, transactionTemplate);
    }
    
    @Bean
    public OrderCanceller orderCanceller(OrderRepository repository, EventPublisher eventPublisher) {
        return new CancelOrderUseCase(repository, eventPublisher);
    }
}
```

##### 4.2.1.3. Estrutura de Configuração Recomendada

```
boot/
├── Application.java                 # @SpringBootApplication
├── config/
│   ├── AdaptersConfig.java          # @Configuration - beans de adaptadores
│   ├── UseCasesConfig.java          # @Configuration - beans de casos de uso
│   ├── InfrastructureConfig.java    # @Configuration - beans de infra (DataSource, etc.)
│   └── SecurityConfig.java          # @Configuration - configurações de segurança
└── profiles/
    ├── ProductionConfig.java        # @Configuration @Profile("production")
    ├── HomologConfig.java           # @Configuration @Profile("homolog")
    └── TestConfig.java              # @Configuration @Profile("test")
```

#### 4.2.2. Configuração para Testes

A mesma estrutura **DEVE** ser aplicável para contextos de teste, substituindo adaptadores reais por dublês:

```java
// TEST CONFIGURATION
@BeforeEach
void setup() {
    // Secondary Adapters: TEST DOUBLES
    OrderRepository repository = new FakeOrderRepository();
    NotificationSender notifier = mock(NotificationSender.class);
    RateProvider rateProvider = new StubRateService(BigDecimal.valueOf(0.10));
    
    // Application: SAME PRODUCTION CODE
    this.useCase = new CreateOrder(repository, notifier, rateProvider);
}
```

### 4.3. Validação

#### 4.3.1. Validação nas Camadas

A validação **DEVE** ser distribuída de acordo com a natureza e o contexto da regra. Cada camada é responsável por um tipo específico de validação:

| Tipo de Validação | Localização | Responsabilidade | Exemplos |
|-------------------|-------------|------------------|----------|
| **Sintática (Formato)** | Adaptador Primário ou Command/Query DTO | Verificar estrutura e formato dos dados de entrada | Email válido, CPF formatado, campos obrigatórios preenchidos |
| **Semântica (Regras de Domínio)** | Entidade de Domínio | Garantir invariantes do conceito de negócio | Saldo não pode ser negativo, data de fim após data de início |
| **Contextual (Estado)** | Caso de Uso | Validar condições que dependem de estado atual do sistema | Pedido já foi cancelado, cliente está ativo, estoque disponível |
| **Autorização** | Adaptador Primário ou Caso de Uso | Verificar permissões do ator | Usuário pode cancelar apenas seus próprios pedidos |

#### 4.3.2. Implementação de Validação Sintática

```java
// Validation in the Command itself (fail-fast)
public record CreateOrderCommand(
    String customerId,
    List<OrderItemCommand> items,
    String deliveryAddress
) {
    public CreateOrderCommand {
        // Syntactic validation in constructor
        if (customerId == null || customerId.isBlank()) {
            throw new IllegalArgumentException("customerId is required");
        }
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }
        if (deliveryAddress == null || deliveryAddress.isBlank()) {
            throw new IllegalArgumentException("deliveryAddress is required");
        }
    }
}
```

#### 4.3.3. Implementação de Validação Semântica

```java
// Validation in Domain Entity (business invariants)
public class Order {
    private final String id;
    private final List<OrderItem> items;
    private BigDecimal totalAmount;
    private OrderStatus status;
    
    public void applyDiscount(BigDecimal percentage) {
        // Semantic validation: business rule
        if (percentage.compareTo(BigDecimal.valueOf(0.50)) > 0) {
            throw new DiscountExceedsMaximumException(
                "Discount cannot exceed 50%"
            );
        }
        this.totalAmount = this.totalAmount.multiply(
            BigDecimal.ONE.subtract(percentage)
        );
    }
    
    public void cancel(String reason) {
        // Semantic validation: valid state transition
        if (this.status == OrderStatus.DELIVERED) {
            throw new InvalidOperationException(
                "Delivered order cannot be cancelled"
            );
        }
        this.status = OrderStatus.CANCELLED;
    }
}
```

#### 4.3.4. Implementação de Validação Contextual

```java
// Validation in Use Case (depends on external state)
public class CancelOrder {
    
    private final OrderRepository repository;
    
    @Override
    public void cancel(CancelOrderCommand command) {
        // Fetch current state
        Order order = repository
                        .findById(command.orderId())
                        .orElseThrow(() -> new OrderNotFoundException(command.orderId()));
        
        // Contextual validation: depends on persisted state
        if (order.wasCreatedMoreThan(Duration.ofHours(24))) {
            throw new CancellationPeriodExpiredException("Cancellation allowed only within the first 24 hours");
        }
        
        // Delegate to entity semantic validation
        order.cancel(command.reason());
        
        repository.save(order);
    }
}
```

### 4.4. Tratamento de Exceções e Erros

#### 4.4.1. Taxonomia de Exceções

O tratamento de exceções **DEVE** seguir uma hierarquia clara que reflita a origem e natureza do erro:

| Categoria | Localização da Definição | Responsável pelo Tratamento | Exemplos |
|-----------|--------------------------|----------------------------|----------|
| **Exceções de Domínio** | `application/domain/exceptions/` | Propagadas até o Adaptador Primário | `InsufficientBalanceException`, `OrderAlreadyCancelledException` |
| **Exceções de Aplicação** | `application/exceptions/` | Propagadas até o Adaptador Primário | `ResourceNotFoundException`, `OperationNotAllowedException` |
| **Exceções de Infraestrutura** | `adapters/exceptions/` | Convertidas em Exceções de Aplicação pelo Adaptador Secundário | `SQLException`, `HttpTimeoutException`, `IOException` |

#### 4.4.2. Hierarquia de Exceções Prescrita

```java
// ═══════════════════════════════════════════════════════════════════════════
// DOMAIN EXCEPTIONS (application/domain/exceptions/)
// ═══════════════════════════════════════════════════════════════════════════

// Base domain exception - all business exceptions inherit from this
public abstract class DomainException extends RuntimeException {
    private final String code;
    
    protected DomainException(String code, String message) {
        super(message);
        this.code = code;
    }
    
    public String getCode() { return code; }
}

// Specific domain exceptions
public class InsufficientBalanceException extends DomainException {
    public InsufficientBalanceException(BigDecimal currentBalance, BigDecimal requiredAmount) {
        super("INSUFFICIENT_BALANCE", 
              String.format("Balance %.2f insufficient for operation of %.2f", currentBalance, requiredAmount));
    }
}

public class LimitExceededException extends DomainException {
    public LimitExceededException(String resource, int limit) {
        super("LIMIT_EXCEEDED",
              String.format("Limit of %d exceeded for %s", limit, resource));
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// APPLICATION EXCEPTIONS (application/exceptions/)
// ═══════════════════════════════════════════════════════════════════════════

public abstract class ApplicationException extends RuntimeException {
    private final String code;
    
    protected ApplicationException(String code, String message) {
        super(message);
        this.code = code;
    }
    
    protected ApplicationException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }
    
    public String getCode() { return code; }
}

public class ResourceNotFoundException extends ApplicationException {
    public ResourceNotFoundException(String resource, String id) {
        super("RESOURCE_NOT_FOUND",
              String.format("%s with id '%s' not found", resource, id));
    }
}

public class ServiceUnavailableException extends ApplicationException {
    public ServiceUnavailableException(String service, Throwable cause) {
        super("SERVICE_UNAVAILABLE",
              String.format("Service '%s' temporarily unavailable", service), cause);
    }
}
```

#### 4.4.3. Tradução de Exceções nos Adaptadores

```java
// ═══════════════════════════════════════════════════════════════════════════
// SECONDARY ADAPTER: Translates infrastructure exceptions
// ═══════════════════════════════════════════════════════════════════════════
public class SqlOrderAdapter implements OrderRepository {
    
    @Override
    public void save(Order order) {
        try {
            // Persistence operation
            jdbcTemplate.update(SQL_INSERT, /* params */);
        } catch (DataAccessException e) {
            // TRANSLATION: Infrastructure exception → Application exception
            throw new ServiceUnavailableException("Database", e);
        }
    }
    
    @Override
    public Optional<Order> findById(String id) {
        try {
            // Query operation
            return Optional.ofNullable(jdbcTemplate.queryForObject(SQL_SELECT, mapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty(); // NOT an error, just absence of data
        } catch (DataAccessException e) {
            throw new ServiceUnavailableException("Database", e);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIMARY ADAPTER: Translates domain/application exceptions to technology
// ═══════════════════════════════════════════════════════════════════════════
@RestController
public class OrderRestController {
    
    private final CreateOrder orderPlacer;
    
    @PostMapping("/orders")
    public ResponseEntity<?> create(@RequestBody CreateOrderRequest request) {
        try {
            CreateOrderCommand command = mapToCommand(request);
            OrderCreatedResponse response = orderPlacer.create(command);
            return ResponseEntity.status(201).body(response);
            
        } catch (DomainException e) {
            // Domain exceptions → 422 Unprocessable Entity
            return ResponseEntity.status(422).body(new ErrorResponse(e.getCode(), e.getMessage()));
            
        } catch (ResourceNotFoundException e) {
            // Resource not found → 404 Not Found
            return ResponseEntity.status(404).body(new ErrorResponse(e.getCode(), e.getMessage()));
            
        } catch (ServiceUnavailableException e) {
            // Service unavailable → 503 Service Unavailable
            return ResponseEntity.status(503).body(new ErrorResponse(e.getCode(), e.getMessage()));
        }
    }
}
```

#### 4.4.4. Mapeamento de Exceções para Códigos HTTP

| Tipo de Exceção | Código HTTP | Significado |
|-----------------|-------------|-------------|
| `DomainException` (regra de negócio violada) | **422** Unprocessable Entity | Requisição válida sintaticamente, mas viola regras de negócio |
| `ResourceNotFoundException` | **404** Not Found | Recurso solicitado não existe |
| `OperationNotAllowedException` | **403** Forbidden | Operação não autorizada para o ator |
| `ServiceUnavailableException` | **503** Service Unavailable | Dependência externa indisponível |
| `IllegalArgumentException` (validação sintática) | **400** Bad Request | Dados de entrada malformados |

### 4.5. Eventos de Domínio

#### 4.5.1. Definição e Propósito

**Eventos de Domínio** representam fatos significativos que ocorreram no domínio de negócio. Eles permitem desacoplamento entre agregados e comunicação assíncrona entre bounded contexts.

#### 4.5.2. Estrutura de um Evento de Domínio

```java
// ═══════════════════════════════════════════════════════════════════════════
// DOMAIN EVENTS (application/domain/events/)
// ═══════════════════════════════════════════════════════════════════════════

// Base interface for all events
public interface DomainEvent {
    String getEventId();
    Instant getOccurredOn();
    String getAggregateId();
    String getEventType();
}

// Abstract base class with common implementation
public abstract class BaseDomainEvent implements DomainEvent {
    private final String eventId;
    private final Instant occurredOn;
    private final String aggregateId;
    
    protected BaseDomainEvent(String aggregateId) {
        this.eventId = UUID.randomUUID().toString();
        this.occurredOn = Instant.now();
        this.aggregateId = aggregateId;
    }
    
    @Override
    public String getEventType() {
        return this.getClass().getSimpleName();
    }
    
    // getters...
}

// Concrete events
public class OrderCreatedEvent extends BaseDomainEvent {
    private final String customerId;
    private final BigDecimal totalAmount;
    private final List<String> itemIds;
    
    public OrderCreatedEvent(String orderId, String customerId, 
                             BigDecimal totalAmount, List<String> itemIds) {
        super(orderId);
        this.customerId = customerId;
        this.totalAmount = totalAmount;
        this.itemIds = List.copyOf(itemIds); // Immutable
    }
    
    // getters...
}

public class OrderCancelledEvent extends BaseDomainEvent {
    private final String reason;
    private final Instant cancelledAt;
    
    public OrderCancelledEvent(String orderId, String reason) {
        super(orderId);
        this.reason = reason;
        this.cancelledAt = Instant.now();
    }
    
    // getters...
}
```

#### 4.5.3. Porta de Saída para Publicação de Eventos

```java
// ═══════════════════════════════════════════════════════════════════════════
// OUTPUT PORT (application/ports/output/)
// ═══════════════════════════════════════════════════════════════════════════
public interface EventPublisher {
    void publish(DomainEvent event);
    void publishAll(List<DomainEvent> events);
}
```

#### 4.5.4. Coleta de Eventos nas Entidades de Domínio

```java
// Entity with event support
public class Order {
    private final String id;
    private OrderStatus status;
    private final List<DomainEvent> domainEvents = new ArrayList<>();
    
    public static Order create(String customerId, List<Item> items) {
        Order order = new Order(UUID.randomUUID().toString());
        order.status = OrderStatus.CREATED;
        
        // Register event
        order.registerEvent(new OrderCreatedEvent(
            order.id, 
            customerId, 
            order.calculateTotal(),
            items.stream().map(Item::getId).toList()
        ));
        
        return order;
    }
    
    public void cancel(String reason) {
        if (this.status == OrderStatus.DELIVERED) {
            throw new InvalidOperationException("Delivered order cannot be cancelled");
        }
        
        this.status = OrderStatus.CANCELLED;
        
        // Register event
        registerEvent(new OrderCancelledEvent(this.id, reason));
    }
    
    private void registerEvent(DomainEvent event) {
        this.domainEvents.add(event);
    }
    
    public List<DomainEvent> collectEvents() {
        List<DomainEvent> events = List.copyOf(this.domainEvents);
        this.domainEvents.clear();
        return events;
    }
}
```

#### 4.5.5. Publicação de Eventos no Caso de Uso

```java
public class CreateOrderUseCase implements OrderPlacer {
    
    private final OrderRepository repository;
    private final EventPublisher eventPublisher;
    
    @Override
    public OrderCreatedResponse create(CreateOrderCommand command) {
        // Create entity (event is registered internally)
        Order order = Order.create(command.customerId(), command.items());
        
        // Persist
        repository.save(order);
        
        // Publish collected events
        eventPublisher.publishAll(order.collectEvents());
        
        return mapToResponse(order);
    }
}
```

#### 4.5.6. Adaptador para Publicação de Eventos

```java
// ═══════════════════════════════════════════════════════════════════════════
// SECONDARY ADAPTER (infrastructure/adapters/driven/messaging/)
// ═══════════════════════════════════════════════════════════════════════════
public class KafkaEventPublisher implements EventPublisher {
    
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    
    @Override
    public void publish(DomainEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            String topic = resolveTopic(event);
            kafkaTemplate.send(topic, event.getAggregateId(), payload);
        } catch (JsonProcessingException e) {
            throw new EventPublishException("Failed to serialize event", e);
        }
    }
    
    @Override
    public void publishAll(List<DomainEvent> events) {
        events.forEach(this::publish);
    }
    
    private String resolveTopic(DomainEvent event) {
        return "domain-events-" + event.getEventType().toLowerCase();
    }
}
```

### 4.6. Anti-Padrões (Práticas a Evitar)

Esta seção documenta práticas que violam os princípios da Arquitetura Hexagonal e **DEVEM** ser evitadas.

#### 4.6.1. Catálogo de Anti-Padrões

| Anti-Padrão | Descrição | Violação | Consequência |
|-------------|-----------|----------|---------------|
| **Anemic Domain Model** | Entidades com apenas getters/setters, sem lógica de negócio | Lógica dispersa em serviços | Domínio não protege suas invariantes |
| **Leaking Abstractions** | DTOs de infraestrutura no domínio | Dependência invertida | Domínio acoplado a tecnologia |
| **God Use Case** | Caso de uso com múltiplas responsabilidades | Princípio da Responsabilidade Única | Difícil testar e manter |
| **Direct Repository Call** | Adaptador primário chamando repositório diretamente | Bypass da lógica de negócio | Regras de negócio não aplicadas |
| **Port Pollution** | Porta com métodos que não representam capacidade de negócio | Coesão | Interface inflada e confusa |
| **Adapter in Domain** | Código de adaptador dentro do hexágono | Isolamento tecnológico | Domínio contaminado |
| **Shared Kernel Abuse** | Dependência excessiva entre bounded contexts | Acoplamento | Mudanças propagam entre contextos |

#### 4.6.2. Exemplos de Anti-Padrões e Correções

##### Anti-Padrão: Anemic Domain Model

```java
// ❌ WRONG: Anemic entity
public class Order {
    private String id;
    private BigDecimal amount;
    private String status;
    
    // Only getters and setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

// Logic in external service (WRONG)
public class OrderService {
    public void cancel(Order order) {
        if (!order.getStatus().equals("DELIVERED")) {
            order.setStatus("CANCELLED");
        }
    }
}

// ✅ CORRECT: Rich entity
public class Order {
    private final String id;
    private BigDecimal amount;
    private OrderStatus status;
    
    public void cancel(String reason) {
        if (this.status == OrderStatus.DELIVERED) {
            throw new InvalidOperationException("Delivered order cannot be cancelled");
        }
        this.status = OrderStatus.CANCELLED;
    }
    
    // Status has no public setter - only business methods can change it
    public OrderStatus getStatus() { return status; }
}
```

##### Anti-Padrão: Direct Repository Call

```java
// ❌ WRONG: Controller calling repository directly
@RestController
public class OrderController {
    
    private final OrderRepository repository; // WRONG!
    
    @PostMapping("/orders")
    public ResponseEntity<Order> create(@RequestBody OrderRequest request) {
        Order order = new Order(request.getCustomerId());
        repository.save(order); // Bypass of business logic!
        return ResponseEntity.ok(order);
    }
}

// ✅ CORRECT: Controller uses Input Port
@RestController  
public class OrderController {
    
    private final OrderPlacer orderPlacer; // Input Port
    
    @PostMapping("/orders")
    public ResponseEntity<OrderCreatedResponse> create(@RequestBody OrderRequest request) {
        CreateOrderCommand command = mapToCommand(request);
        OrderCreatedResponse response = orderPlacer.create(command);
        return ResponseEntity.status(201).body(response);
    }
}
```

##### Anti-Padrão: Leaking Abstractions

```java
// ❌ WRONG: Infrastructure types in domain
public class ProcessPaymentUseCase {    
    public void process(HttpServletRequest request) { // WRONG!
        String card = request.getParameter("card");
        // ...
    }
}

// ❌ WRONG: Output port with infrastructure types
public interface PaymentGateway {
    JsonNode process(JsonNode payload); // WRONG!
}

// ✅ CORRECT: Neutral types
public class ProcessPaymentUseCase {    
    public PaymentResult process(ProcessPaymentCommand command) {
        // command contains only domain data
    }
}

public interface PaymentGateway {
    PaymentResult process(PaymentData data); // Domain types
}
```

##### Anti-Padrão: God Use Case

```java
// ❌ WRONG: Use Case doing everything
public class ManageOrdersUseCase {
    public void create(CreateOrderCommand cmd) { /* ... */ }
    public void cancel(CancelOrderCommand cmd) { /* ... */ }
    public void update(UpdateOrderCommand cmd) { /* ... */ }
    public void approve(ApproveOrderCommand cmd) { /* ... */ }
    public List<Order> list(ListOrdersQuery query) { /* ... */ }
    public Order find(FindOrderQuery query) { /* ... */ }
    public void sendNotification(String orderId) { /* ... */ }
    public void generateReport(ReportCommand cmd) { /* ... */ }
}

// ✅ CORRECT: One Use Case per business operation
public class CreateOrderUseCase implements OrderPlacer { /* ... */ }
public class CancelOrderUseCase implements OrderCanceller { /* ... */ }
public class FindOrderUseCase implements OrderFinder { /* ... */ }
```

#### 4.6.3. Checklist de Detecção de Anti-Padrões

| # | Verificação | Indica Anti-Padrão Se... |
|---|-------------|-------------------------|
| 1 | Entidade tem mais setters que métodos de negócio? | **SIM** → Anemic Domain Model |
| 2 | Caso de Uso tem mais de 5 métodos públicos? | **SIM** → God Use Case |
| 3 | Porta de Saída usa `JsonNode`, `ResultSet`, `HttpRequest`? | **SIM** → Leaking Abstractions |
| 4 | Adaptador Primário injeta Repository diretamente? | **SIM** → Direct Repository Call |
| 5 | Módulo `application/domain` importa `spring.*` ou `javax.*`? | **SIM** → Adapter in Domain |
| 6 | Porta de Entrada tem método `salvar(Entidade)`? | **SIM** → Port Pollution (CRUD genérico) |

---

## 5. PADRÕES RELACIONADOS E REFERÊNCIAS CRUZADAS

### 5.1. Relação com Outros Padrões

| Padrão | Relação com Arquitetura Hexagonal |
|--------|----------------------------------|
| **Strategy (GoF)** | A arquitetura é formulada como caso especial de "Componente + Estratégia". Adaptadores são estratégias concretas injetadas. |
| **Adapter (GoF)** | O nome "Ports and Adapters" deriva diretamente deste padrão. Adaptadores convertem interfaces externas para o protocolo das portas. |
| **Mock Objects** | Padrão essencial para testabilidade. Mocks funcionam como adaptadores secundários em contexto de teste. |
| **Repository (DDD)** | Padrão frequentemente utilizado para implementar Portas de Saída relacionadas a persistência de agregados. |

### 5.2. Referências Bibliográficas

1. Cockburn, A. (2005). *Hexagonal Architecture*. alistair.cockburn.us
2. Martin, R. C. (2003). *Agile Software Development: Principles, Patterns, and Practices*. Prentice Hall.
3. Gamma, E. et al. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley.
4. Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.

---

## ANEXO A: GLOSSÁRIO DE TERMOS

| Termo | Definição |
|-------|-----------|
| **Ator Primário (Condutor)** | Entidade externa que inicia interação com a aplicação (ex: usuário, teste). |
| **Ator Secundário (Conduzido)** | Entidade externa acionada pela aplicação (ex: banco de dados, serviço externo). |
| **API (Application Programming Interface)** | Interface fornecida pelo aplicativo; define serviços oferecidos. |
| **SPI (Service Provider Interface)** | Interface requerida pelo aplicativo; define serviços necessários. |
| **Composition Root** | Ponto único de montagem do grafo de dependências da aplicação. |
| **Dublê de Teste** | Implementação substituta de uma porta para fins de teste (*mock*, *stub*, *fake*, *spy*). |

---

## ANEXO B: GERENCIAMENTO DE TRANSAÇÕES

### B.1. Princípio Geral

O gerenciamento de transações é uma **preocupação de infraestrutura** e, portanto, **NÃO DEVE** residir dentro do hexágono (módulo `application/`). A demarcação transacional deve ser tratada como um aspecto ortogonal à lógica de negócio.

### B.2. Abordagens Recomendadas

#### B.2.1. Transações no Configurador (Composition Root)

A abordagem mais alinhada com a Arquitetura Hexagonal é gerenciar transações no módulo `boot/`, utilizando decoradores ou proxies:

```java
// ═══════════════════════════════════════════════════════════════════════════
// LAYER: boot/ - Transaction management via decorator
// ═══════════════════════════════════════════════════════════════════════════

@Configuration
public class UseCasesConfig {
    
    @Bean
    public CreateOrder createOrder(
            OrderRepository repository,
            NotificationSender notifier,
            TransactionTemplate transactionTemplate) {
        
        // Pure use case (no transaction awareness)
        CreateOrder pureUseCase = new CreateOrder(repository, notifier);
        
        // Wrap with transactional decorator
        return command -> transactionTemplate.execute(status -> 
            pureUseCase.create(command)
        );
    }
}
```

#### B.2.2. Transações no Adaptador Primário

Alternativamente, a demarcação pode ocorrer no adaptador primário, antes de invocar a porta de entrada:

```java
// ═══════════════════════════════════════════════════════════════════════════
// LAYER: adapters/in/ - Transaction at adapter level
// ═══════════════════════════════════════════════════════════════════════════

@RestController
@RequestMapping("/api/orders")
public class OrderRestController {
    
    private final CreateOrder createOrder;
    private final TransactionTemplate transactionTemplate;
    
    @PostMapping
    public ResponseEntity<OrderCreatedResponse> create(@RequestBody CreateOrderRequest request) {
        CreateOrderCommand command = mapToCommand(request);
        
        // Transaction managed at adapter level
        OrderCreatedResponse response = transactionTemplate.execute(status ->
            createOrder.create(command)
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

### B.3. Práticas a Evitar

| Prática | Problema | Alternativa |
|---------|----------|-------------|
| `@Transactional` em Casos de Uso | Acopla aplicação ao Spring | Usar decorador no `boot/` |
| `@Transactional` em Entidades de Domínio | Viola isolamento do domínio | Gerenciar no adaptador ou configurador |
| Transações programáticas no domínio | Lógica de infra no hexágono | Extrair para camada externa |

### B.4. Considerações sobre Consistência

#### B.4.1. Transações Locais vs. Distribuídas

| Cenário | Abordagem Recomendada |
|---------|----------------------|
| Operação em único banco de dados | Transação local (ACID) |
| Múltiplos agregados no mesmo bounded context | Transação local com eventos de domínio |
| Operações entre bounded contexts | Saga pattern ou consistência eventual |
| Integração com serviços externos | Outbox pattern + eventos |

#### B.4.2. Padrão Outbox para Consistência

Quando é necessário garantir consistência entre persistência e publicação de eventos:

```java
// ═══════════════════════════════════════════════════════════════════════════
// SECONDARY ADAPTER: Outbox pattern implementation
// ═══════════════════════════════════════════════════════════════════════════

public class TransactionalEventPublisher implements EventPublisher {
    
    private final OutboxRepository outboxRepository;
    
    @Override
    public void publish(DomainEvent event) {
        // Instead of publishing directly, save to outbox table
        // (within the same transaction as the aggregate)
        OutboxEntry entry = new OutboxEntry(
            event.getEventId(),
            event.getEventType(),
            serialize(event),
            Instant.now()
        );
        outboxRepository.save(entry);
    }
}

// Separate process reads outbox and publishes to message broker
// This guarantees at-least-once delivery
```

### B.5. Resumo das Responsabilidades

| Componente | Responsabilidade Transacional |
|------------|------------------------------|
| **Entidade de Domínio** | Nenhuma — desconhece transações |
| **Caso de Uso** | Nenhuma — lógica pura de negócio |
| **Porta de Saída** | Nenhuma — apenas define contrato |
| **Adaptador Secundário** | Pode participar de transações, mas não as demarca |
| **Adaptador Primário** | Pode demarcar transações (alternativa) |
| **Configurador (boot/)** | Local preferencial para demarcação via decoradores |

---

**FIM DO DOCUMENTO**

*Este documento está sujeito a revisões periódicas. Consulte o repositório oficial para a versão mais atual.*