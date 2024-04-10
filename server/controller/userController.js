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


const isPasswordStrong = (password) => {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

    if (password.length < 8) {
        return "Password must be at least 8 characters long"
    }
    else if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter"
    }
    else if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter"
    }
    else if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number"
    }
    else if (!/[!@#$%^&*]/.test(password)) {
        return "Password must contain at least one special character"
    }
    else {
        return 'strongpassword'
    }
};
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
const userRegister = async (req, res) => {
    try {
        const { name, email, image, password , role } = req.body
        if (!name || !email || !image || !password) {
            return res.status(404).json({ message: "All field required" })
        }
        else {
            if(!isValidEmail(email)) {
                return res.status(404).json({ message: "Email is not correct" })
            }
            const userExist = await sql`SELECT * FROM users WHERE email=${email}`
            // console.log(userExist)
            if (userExist.length > 0) {
                return res.status(404).json({ message: "user already exist" })
            }
            else {

                // check password strength

                const checkPasswordStrength = isPasswordStrong(password)

                if (checkPasswordStrength !== 'strongpassword') {
                    return res.status(404).json({ message: checkPasswordStrength })
                }

                // hash password
                const genSalt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, genSalt)
                
                await sql`INSERT INTO users (name , email , image , password,role) 
                VALUES (${name},${email},${image},${hashPassword},${role}) `
                resend.emails.send({
                    from: 'Aeonaxy@resend.dev',
                    to: 'jitenderkumarmukul@gmail.com',
                    subject: 'Register successfuly',
                    html: '<p>Congrats on Register successfuly <strong>with email</strong>!</p>'
                });
                return res.status(200).json({ message: "User registered successfully"});
            }
        }
    } catch (error) {
        console.log(error)
    }
}


const loginUsers = async (req, res) => {
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
                        subject: 'Login successfuly',
                        html: '<p>Congrats on Login successfuly <strong>with email</strong>!</p>'
                    });
                    const token = jwt.sign({id:userExist[0].userid},SECRET_KEY,{expiresIn:'5h'})

                    return res.status(200).json({ message: "user login successfuly",token })
                }

            }
            else {
                return res.status(404).json({ message: "user not found" })
            }
        }
    } catch (error) {
        console.error(error)
    }
}


const getUser = async (req,res)=>{
     try {
        const {id} = req.params
        // console.log(id)
        if(id) {
              const userFind = await sql`SELECT name,email,image FROM users WHERE userid=${id}` 
            //   console.log(userFind[0])
              if(userFind.length===0) {
                  return res.status(404).json({ message: "user not found" })
              }

              return res.status(200).json(userFind[0])
        }
        else {
            return res.status(404).json({ message: "user not found" })
        }
     } catch (error) {
        console.error(error)
     }
}


const updateUser = async (req,res)=>{
       try {
           const {name,email,image} = req.body
           const {id} = req.params 
           const userFind = await sql`SELECT * FROM users WHERE userid=${id}`
           if(userFind.length === 0) {
                  return res.status(404).json({ message: "user not found" })
           }

           await sql`UPDATE users 
             SET name=${name} , email=${email} , image=${image} WHERE userid=${id} `
            
             resend.emails.send({
                from: 'Aeonaxy@resend.dev',
                to: 'jitenderkumarmukul@gmail.com',
                subject: 'Update user successfuly',
                html: '<p>Congrats on Update successfuly <strong>with email</strong>!</p>'
            });
             return res.status(200).json({message:"user update successfuly"})
            
       } catch (error) {
            console.error(error)
       }
} 


exports.updateUser = updateUser
exports.getUser = getUser
exports.userRegister = userRegister
exports.loginUsers = loginUsers












