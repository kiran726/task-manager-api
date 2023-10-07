const User = require("../models/user")
const Task=require("../models/task")
require("../db/mongoose")

// User.findByIdAndUpdate("651d921371607922ec342e95",{age:1}).then((result)=>{
//     console.log(result)
//     return User.countDocuments({age:1})
// }).then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })

const updateAgeAndCount =async (id,age) => {
const user=await User.findByIdAndUpdate(id,{age})
const count=await User.countDocuments({age})
return count
}

// updateAgeAndCount("651d921371607922ec342e95",20).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log("Error",e)
// })

const deleteTaskAndCount = async (id) =>{
    await Task.findByIdAndDelete(id)
    const count=await Task.countDocuments({completed:false})
    return count
}

deleteTaskAndCount("651d90e783e2817f7f8184db").then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error)
})