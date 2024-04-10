const postgres = require('postgres');
require('dotenv').config();
const { Resend } = require('resend')

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID ,SECRET_KEY} = process.env;

const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
});

const resend = new Resend('re_7ACe5bqd_Q3zMUdwrr5wdux8wYnZuw3hb')


const getAllCourses=async(req,res)=>{
     try {
        const { category, level, page = 1, limit = 10 } = req.query;
        let query = `SELECT * FROM courses`;

        // Apply filters if provided
        if (category) {
            query += ` WHERE category = ${category}`;
        }
        if (level) {
            if (category) {
                query += ` AND level = ${level}`;
            } else {
                query += ` WHERE level = ${level}`;
            }
        }

        // Apply pagination
        const offset = (page - 1) * limit;
        query += ` LIMIT ${limit} OFFSET ${offset}`;

        const courses = await sql(query);
        return res.status(200).json(courses);
     } catch (error) {
         console.error(error)
     }
}


exports.getAllCourses=getAllCourses