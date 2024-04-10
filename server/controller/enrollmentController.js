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



const enrollUser = async (req,res) =>{
      try {
          const {id} = req.params 
          const {courseid} = req.body 
          console.log(id)
          const userExists = await sql`SELECT * FROM users WHERE userid = ${id}`;

        if (userExists.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
          const checkForUserenrolled = await sql`SELECT * FROM enrollmentUser WHERE userid=${id} AND courseid=${courseid}`

          if(checkForUserenrolled.length > 0) {
              return res.status(404).json({message:"user enrolled in course already"})
          }
          
          await sql`INSERT INTO enrollmentUser (userid,courseid)
            VALUES (${id},${courseid})`

            resend.emails.send({
                from: 'Aeonaxy@resend.dev',
                to: 'jitenderkumarmukul@gmail.com',
                subject: 'Enrolled course successfuly',
                html: '<p>Congrats on Enrolled successfuly <strong>with email</strong>!</p>'
            });
             return res.status(200).json({message:"Enrolled Course successfuly"})

      } catch (error) {
         console.error(error)
      }
}

const userEnrolledCourse = async(req,res)=>{
      try {
          const {id} = req.params 
          const enrolledCourse = await sql`SELECT courses.*,enrollmentUser.* FROM courses INNER JOIN enrollmentUser ON 
          courses.courseid = enrollmentUser.courseid WHERE enrollmentUser.userid=${id} `
          return res.status(200).json(enrolledCourse[0])
      } catch (error) {
         console.error(error)
      }
}


exports.userEnrolledCourse = userEnrolledCourse
exports.enrollUser = enrollUser