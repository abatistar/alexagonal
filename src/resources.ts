/**
 * Módulo de gerenciamento de recursos
 * Fornece funções para carregar e gerenciar recursos de forma centralizada
 * Cada recurso é representado por um arquivo de asset com metadados associados
 */

import { readAssetFile } from "./file_util.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface ResourceConfig {
    name: string;
    fileName: string;
    description?: string;
    mimeType?: string;
}

export interface Resource {
    name: string;
    uri: string;
    description: string;
    content: string;
    mimeType: string;
}

async function getResource(config: ResourceConfig): Promise<Resource | null> {
    try {
        const content = await readAssetFile(config.fileName);
        return {
            name: config.name,
            uri: `resource://${config.fileName}`,
            description: config.description || '',
            content,
            mimeType: config.mimeType || 'text/plain',
        };
    } catch (error) {
        console.error(`Erro ao carregar o recurso ${config.name}:`, error);
        return null;
    }
}

async function getResources(resourceConfigs: ResourceConfig[]) {
    const resources = await Promise.all(resourceConfigs.map(config => getResource(config)));
    return resources.filter((resource): resource is Resource => resource !== null);
}

export async function registerResources(server: McpServer, resourceConfigs: ResourceConfig[]): Promise<any[]> {

    const resources: Resource[] = await getResources(resourceConfigs);

    for (const resource of resources) {
        server.resource(
            resource.name,
            resource.uri,
            {
                description: resource.description,
                mimeType: resource.mimeType
            },
            async () => ({
                contents: [
                    {
                        uri: resource.uri,
                        text: resource.content,
                        mimeType: resource.mimeType
                    }
                ]
            })
        );
    }

    const contents: any[] = [];

    resources.forEach(item => {
        contents.push(
            {
                "type": "resource",
                "resource": {
                    "uri": item.uri,
                    "text": item.content,
                    "mimeType": item.mimeType
                }
            }
        );
    });

    return contents;
}


