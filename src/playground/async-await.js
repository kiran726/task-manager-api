const add = (a,b)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(a+b)
        },2000)
    })
}
// add(1,2).then((result)=>{
//     console.log(result)
//     return add(result,3)
// }).then((result2)=>{
//     console.log(result2)
// }).catch((e)=>{
//     console.log("Error")
// })
const doWork =async ()=>{
    const sum=await add(2,3)
    const sum2=await add(sum,4)
    return sum2
    // throw new Error("a")
}

doWork().then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log("error",error)
})