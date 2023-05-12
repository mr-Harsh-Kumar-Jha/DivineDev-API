import pg from "pg";
import * as dotenv from "dotenv";
const Pool = pg.Pool;

dotenv.config();

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

export default pool;
