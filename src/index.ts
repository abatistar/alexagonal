import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as architectural_audit_tool from "./architectural_audit_tool.js";

// Configuração do servidor MCP
const server = new McpServer({
    name: "alexagonal-server",
    version: "1.0.0",
});

/**
 * Função principal para inicializar o servidor
 */
async function main(): Promise<void> {

    // Registra os recursos e handlers do módulo de auditoria arquitetural
    await architectural_audit_tool.register(server);

    const transport = new StdioServerTransport();
    console.error("Alexagonal MCP Server iniciando...");
    await server.connect(transport);
    console.error("✅ Servidor MCP conectado e pronto para receber requisições.");
}

// Executa o servidor
main().catch((error) => {
    console.error("❌ Erro fatal ao iniciar o servidor MCP:", error);
    process.exit(1);
});
