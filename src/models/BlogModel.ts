import { int, text, mysqlTable, mysqlSchema, serial, varchar } from 'drizzle-orm/mysql-core';


const table = mysqlTable('blog', {
    id: serial("id").primaryKey().autoincrement(),
    name: varchar("name", {length: 256}),
    
})

