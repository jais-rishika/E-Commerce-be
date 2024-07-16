const express=require("express")
const app=express()

require("dotenv").config()
const port=process.env.PORT

const connectDB= require("./config/db")
connectDB();

const fileUpload = require("express-fileupload")
const cookieParser = require('cookie-parser');
app.use(express.json())
app.use(fileUpload())
app.use(cookieParser());

app.get('/',(req,res,next)=>{
    res.json({message: "API running"})
})


const apiRoutes=require("./Routes/apiRoute")
app.use("/api/v1",apiRoutes)


app.use((error,res,next)=>{
    if(process.env.NODE_ENV==="development"){
        res.status(500).json({
            message: error.message,
            stack: error.stack
        })
    }
    else{
        res.status(500).json({
            message: error.message
        })
    }
    next(error )
})


app.listen(port,()=>{
    console.log(`listening to port ${port}`)
})