const mongoose=require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api').then((client)=>{
    console.log("Connected sucessfully")
}).catch((error)=>{
    console.log("Unable to connect to DB")
})



// const t1=new Task({
//     description:"Task1",
//     completed:"task1"
// })

// t1.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log("Error! ",error)
// })