/**
 * Módulo de auditoria arquitetural
 * Fornece funções para realizar auditorias de arquitetura em projetos de software
 * Utiliza recursos e prompts para análise de conformidade com a Arquitetura Hexagonal
 */

import { readAssetFile } from "./file_util.js";
import { ResourceConfig, registerResources } from "./resources.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const prompt = await readAssetFile("architectural-audit-prompt.md");

const resourceConfigs: ResourceConfig[] = [
    {
        name: 'Hexagonal Architecture Specification',
        fileName: 'hexagonal-architecture-specification.md',
        description: 'Especificação detalhada da Arquitetura Hexagonal.',
        mimeType: 'text/markdown'
    }
];

export async function register(server: McpServer) {

    const contents = await registerResources(server, resourceConfigs);

    server.tool(
        "architectural_audit_tool",
        "Ferramenta para realizar auditorias de arquitetura em projetos de software, " +
        "fornecendo especificações e instruções detalhadas para análise de conformidade com o padrão da Arquitetura Hexagonal. " +
        "Use esta ferramenta para verificar a estrutura do código, dependências, e aderência aos princípios de 'Ports and Adapters'.",
        async () => {
            try {
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: prompt,
                        },
                        ...contents
                    ]
                };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                return {
                    content: [
                        {
                            type: "text" as const,
                            text: `❌ Erro ao executar auditoria arquitetural:\n${errorMessage}`
                        },
                    ],
                    isError: true,
                };
            }
        }
    );
}
