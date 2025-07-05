import { DataAPIClient } from "@datastax/astra-db-ts";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
  const db = client.db(process.env.ASTRA_DB_API_ENDPOINT, { namespace: process.env.ASTRA_DB_NAMESPACE });
  const collection = await db.collection(process.env.ASTRA_DB_COLLECTION);
  console.log("Collection methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(collection)));
}

main();

