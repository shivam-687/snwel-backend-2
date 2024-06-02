"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_core_1 = require("drizzle-orm/mysql-core");
const table = (0, mysql_core_1.mysqlTable)('blog', {
    id: (0, mysql_core_1.serial)("id").primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)("name", { length: 256 }),
});
