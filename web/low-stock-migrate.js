import { getDB } from "./low-stock-db.js";

async function createTable() {
  const db = await getDB();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS low_stock_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop TEXT UNIQUE,
      threshold INTEGER DEFAULT 5
    )
  `);

  console.log("✅ low_stock_settings table ready!");
}

createTable();
