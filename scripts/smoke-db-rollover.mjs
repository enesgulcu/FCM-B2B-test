import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function dbNameFromUrl(url) {
  return url?.match(/database=([^;]+)/i)?.[1] || "tanimsiz";
}

loadEnvFile();

const targets = [
  { key: "2026-active", env: "DATABASE_URL_2026", expected: "ETA_ADNAN_2026" },
  { key: "2025-past", env: "DATABASE_URL_2025", expected: "ETA_ADNAN_2025" },
  { key: "edis", env: "DATABASE_URL_EDIS", expected: "ETA_EDIS_2025" },
];

let failed = false;

for (const target of targets) {
  const url = process.env[target.env];
  if (!url) {
    console.log(`${target.key}: MISSING ${target.env}`);
    failed = true;
    continue;
  }

  const configured = dbNameFromUrl(url);
  if (configured !== target.expected) {
    console.log(
      `${target.key}: CONFIG MISMATCH configured=${configured} expected=${target.expected}`
    );
    failed = true;
    continue;
  }

  const client = new PrismaClient({ datasourceUrl: url });
  try {
    await client.$connect();
    const rows = await client.$queryRawUnsafe("SELECT DB_NAME() AS db");
    const connected = rows?.[0]?.db;
    if (connected !== target.expected) {
      console.log(
        `${target.key}: CONNECTED MISMATCH connected=${connected} expected=${target.expected}`
      );
      failed = true;
    } else {
      console.log(`${target.key}: OK -> ${connected}`);
    }
  } catch (error) {
    console.log(`${target.key}: FAIL -> ${error.message.split("\n")[0]}`);
    failed = true;
  } finally {
    await client.$disconnect().catch(() => {});
  }
}

if (failed) {
  process.exit(1);
}

console.log("SMOKE PASS: 2026 active / 2025 past / EDIS ok");
