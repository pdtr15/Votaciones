import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_Ve48rzIqnNAx@ep-solitary-dream-adp1fv1w-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false,
  },
});


export default pool;