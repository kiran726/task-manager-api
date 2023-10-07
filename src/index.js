const express=require("express")
require("./db/mongoose")
const userrouter=require("./routers/user")
const taskrouter=require("./routers/task")

const port=process.env.PORT
const app=express()

app.use(express.json())
app.use(userrouter)
app.use(taskrouter)

app.listen(port,()=>{
    console.log("service is up on port ",port)
})