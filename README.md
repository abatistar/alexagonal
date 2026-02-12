# Alexagonal (MCP Server)

**Alexagonal** é um servidor MCP (Model Context Protocol) projetado para auxiliar desenvolvedores e arquitetos na auditoria e validação de conformidade de projetos de software. **Arquitetura Hexagonal (Ports and Adapters)**.

Este projeto fornece ferramentas e recursos que permitem a um agente de IA analisar a estrutura de código, dependências e padrões de implementação .

## 🚀 Funcionalidades

O servidor expõe ferramentas especializadas para que agentes de IA possam interagir com o código e validá-lo. As ferramentas disponíveis atualmente são:

### `Análise da arquitetura (architectural_audit_tool)`
Ferramenta principal de auditoria que injeta no contexto da IA as especificações completas da Arquitetura Hexagonal e um prompt de auditoria estruturado.
Ela capacita o agente a validar:
- Aderência à taxonomia de pacotes e diretórios.
- Direção correta das dependências (inversão de dependência).
- Isolamento puro da camada de domínio (sem frameworks).
- Implementação correta de Portas (interfaces) e Adaptadores.

#### 💡 Exemplo de Uso
Para iniciar uma auditoria, solicite ao agente:
> *"Execute a ferramenta de auditoria arquitetural para verificar se o código segue os padrões hexagonais."*

> *"Faça uma auditoria da arquitetura ."*


## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (v18 ou superior)
- NPM

### Passos para instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd alexagonal
```

2. Instale as dependências:
```bash
npm install
```

3. Build do projeto:
```bash
npm run build
```

## 💻 Uso

Para rodar o servidor localmente (via stdio):

```bash
npm start
```

### Integração com Clientes MCP

Para utilizar este servidor com um cliente MCP (como Claude Desktop ou extensões de IDE), adicione a seguinte configuração ao seu arquivo de configuração do cliente:

```json
{
  "mcpServers": {
    "alexagonal": {
      "command": "node",
      "args": ["<caminho-absoluto>/alexagonal/dist/index.js"]
    }
  }
}
```

## 📂 Estrutura do Projeto

- `src/`: Código fonte do servidor TypeScript.
  - `index.ts`: Ponto de entrada do servidor.
  - `architectural_audit_tool.ts`: Implementação da ferramenta de auditoria.
  - `resources.ts`: Gerenciamento de recursos do MCP.
  - `file_util.ts`: Utilitários para leitura de arquivos.
- `assets/`: Arquivos de conhecimento e prompts.
  - `architectural-audit-prompt.md`: Prompt detalhado para a IA auditora.
  - `hexagonal-architecture-specification.md`: Especificação de referência da arquitetura.

## 📝 Scripts Disponíveis

- `npm run build`: Compila o TypeScript para JavaScript na pasta `dist/`.
- `npm start`: Inicia o servidor (executa o código compilado).
- `npm run dev`: Executa o servidor em modo de desenvolvimento (usando `tsx`).

## 📄 Licença

Este projeto está licenciado sob a licença Apache-2.0 - veja o arquivo [LICENSE](LICENSE) para detalhes.