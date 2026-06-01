import { readFileSync } from "fs";

type ReadSecretOptions = {
  required?: boolean;
  defaultValue?: string;
}

function stripEnvKeyPrefix(key: string, raw: string): string {
  const trimmed = raw.replace(/uFEFF/, "").trim();
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = trimmed.match(new RegExp(`^\\s*${escaped}\\s*=\\s*(.*)$`, "s"));
  if (m?.[1] != null) return m[1].trim();

  return trimmed;

}

export function readSecret(key: string, options?: ReadSecretOptions): string {
  const filePath = process.env[`${key}_FILE`];

  let value = "";

  if (filePath) {
    try {
      value = stripEnvKeyPrefix(key, readFileSync(filePath, "utf8"));
    } catch (error) {
      throw new Error(`Erro ao ler o arquivo ${filePath}: ${error}`);
    }
  }

  if (!value) {
    const fromEnv = process.env[key] ?? "";
    value = fromEnv ? stripEnvKeyPrefix(key, fromEnv) : "";
  }

  if(!value && typeof options?.defaultValue === "string" ) value = options.defaultValue;
  if(!value && options?.required) throw new Error(`Secret ${key} é obrigatório`);

  return typeof value === "string" ? value.trim() : value;
}