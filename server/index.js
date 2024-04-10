const express = require('express') 
const getPgVersion = require('./db/db')
const app = express() 
const PORT = 3000
const router = require('./routes/routes')
const cors = require('cors') 

app.use(cors())
app.use(express.json())     
app.use('/api',router)


getPgVersion().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server successfuly running on ${PORT}`)
   })
})