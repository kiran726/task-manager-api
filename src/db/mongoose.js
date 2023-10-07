const mongoose=require("mongoose");

mongoose.connect(process.env.MONGODB_URL).then((client)=>{
    
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