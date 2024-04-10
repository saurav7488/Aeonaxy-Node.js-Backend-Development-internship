const postgres = require('postgres');
require('dotenv').config();
const { Resend } = require('resend')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')




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


const adminlogin = async(req,res)=>{
       try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).json({ message: "All field required" })
        }
        else {
            const userExist = await sql`SELECT * FROM users WHERE email=${email}`
            if (userExist.length > 0) {

                // check password is correct or not 

                if ((await bcrypt.compare(password, userExist[0].password))) {
                    resend.emails.send({
                        from: 'Aeonaxy@resend.dev',
                        to: 'jitenderkumarmukul@gmail.com',
                        subject: 'Login successfuly as Admin',
                        html: '<p>Congrats on Login successfuly as Admin <strong>with email</strong>!</p>'
                    });
                    const token = jwt.sign({id:userExist[0].userid,role:userExist[0].role},SECRET_KEY,{expiresIn:'5h'})

                    return res.status(200).json({ message: "Admin login successfuly",token })
                }

            }
            else {
                return res.status(404).json({ message: "admin not found" })
            }
        }
       } catch (error) {
           console.error(error)
       }
}




exports.adminlogin = adminlogin






