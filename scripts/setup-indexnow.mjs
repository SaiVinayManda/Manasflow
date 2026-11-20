import fs from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { INDEXNOW_KEY_PATH, indexNowPayload } from "./lib/indexnow.mjs";

try {
  const key = (await fs.readFile(INDEXNOW_KEY_PATH, "utf8")).trim();
  indexNowPayload("https://manasflow.com", key, ["/"]);
  console.log(`Kept the existing verification key at ${INDEXNOW_KEY_PATH}.`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  await fs.writeFile(INDEXNOW_KEY_PATH, `${randomBytes(16).toString("hex")}\n`, { flag: "wx" });
  console.log(`Created ${INDEXNOW_KEY_PATH}. Deploy it with the site before submitting URLs.`);
}
