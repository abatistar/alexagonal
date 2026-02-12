/*
* Utilitário para leitura de arquivos de assets de forma segura e amigável
* Fornece mensagens de erro claras em caso de falha na leitura
* Centraliza a lógica de acesso a arquivos para facilitar manutenção e melhorias futuras
*/
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Resolve o diretório atual do script para localizar os assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminhos dos arquivos de assets (relativos ao diretório do servidor)
const ASSETS_DIR = join(__dirname, "..", "assets");

/**
 * Lê um arquivo de forma segura, retornando erro amigável se não encontrado
 */
async function readAssetFile(fileName: string): Promise<string> {
    try {
        const filePath = join(ASSETS_DIR, fileName);
        const content = await readFile(filePath, "utf-8");
        return content;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(
            `Não foi possível carregar o arquivo "${fileName}". ` +
            `Detalhes do erro: ${errorMessage}`
        );
    }
}

export { readAssetFile };