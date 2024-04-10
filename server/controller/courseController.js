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



const createCourse = async (req,res) =>{
       try {
            const {category,description,level,popularity,title} = req.body
            // console.log(category)
            if(!category || !description || !level || !popularity || !title) {
                return res.status(404).json({ message: "All field required" })
            }
            else {
                 await sql`INSERT INTO courses (category,description,level,popularity,title)
                 VALUES (${category},${description},${level},${popularity},${title})`
                //  console.log(addNewCourse[0])
                 return res.status(200).json({message:"course add successfuly"})
            }
       } catch (error) {
            console.error(error)
       }
}

const updateCourse=async(req,res)=>{
      try {
        const {category,description,level,popularity,title} = req.body
        const {id} = req.params
        const courseFind = await sql`SELECT * FROM courses WHERE courseid=${id}`
           if(courseFind.length === 0) {
                  return res.status(404).json({ message: "course not found" })
           }

           await sql`UPDATE courses 
             SET category=${category} , description=${description} , level=${level} 
             , popularity=${popularity}, title=${title} WHERE courseid=${id} `
            
             resend.emails.send({
                from: 'Aeonaxy@resend.dev',
                to: 'jitenderkumarmukul@gmail.com',
                subject: 'Update course successfuly',
                html: '<p>Congrats on Update successfuly <strong>with email</strong>!</p>'
            });
             return res.status(200).json({message:"course update successfuly"})

      } catch (error) {
          console.error(error)
      }
}

const deleteCourse=async(req,res)=>{
    try {
        const {id} = req.params
        console.log(id)
        const deleteCourse = await sql`DELETE FROM courses WHERE courseid = ${id}` 
        if (deleteCourse.affectedRows === 0 === 0) {
            return res.status(401).json({ message: 'Course not found' })
          }
      
          return res.status(200).json({ message: 'Course deleted successfully' })
    } catch (error) {
        console.error(error)
    }
}

const getCourseById=async(req,res)=>{
    try {
       const {id} = req.params
    //    console.log(id)
       const findCourse = await sql`SELECT * FROM courses WHERE courseid=${id}`
       if (findCourse.length === 0) {
        return res.status(401).json({ message: 'Course not found' })
      }
      return  res.status(200).json(findCourse[0])
    } catch (error) {
        console.error(error)
    }
}



exports.getCourseById = getCourseById
exports.deleteCourse = deleteCourse
exports.updateCourse = updateCourse
exports.createCourse = createCourse




