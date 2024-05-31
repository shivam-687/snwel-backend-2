
import { CommonConfig } from '@/config/common';
import { logger } from '@/utils/logger';
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = CommonConfig.DATABASE_URL;
const migration = async () => {
    console.log("Migration start", connectionString)
    const sql = postgres(connectionString, { max: 1 })
    const db = drizzle(sql);
    await migrate(db, { migrationsFolder: "drizzle" });
    await sql.end();
    console.log("Migration end", connectionString)
}

migration().catch(error => {
    logger.error("Migration error", error);
    process.exit(1)
})