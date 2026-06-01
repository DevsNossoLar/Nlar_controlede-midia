import { db } from "./config";


export async function dbConnection() {
  try {
    const timeoutMs = 3000;

    await Promise.race([
      db.raw('SELECT 1'),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Timeout ao conectar ao banco de dados')),
          timeoutMs
        )
      )
    ]);
  } catch (error) {
    throw new Error(
      `Falha ao conectar ao banco de dados: ${
        error instanceof Error ? error.message : 'erro desconhecido'
      }`
    );
  }
}