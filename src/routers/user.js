const express=require("express") 
const User=require("../models/user")
const auth=require("../middleware/auth")
const router=express.Router()
const multer=require("multer")
const sharp=require("sharp")

router.post("/users",async (req,res)=>{
    const user=new User(req.body)
    try {
    await user.save()
    const token=await user.generateAuthToken()
    res.status(201).send({user,token})
    }
    catch(e){
        return res.status(400).send(e)
    }
})

router.post("/users/login",async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()

        res.send({user,token})
    }
    catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        return res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try {
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

router.get("/users/me",auth,async (req,res)=>{
   try{
    res.send(req.user)
   }
   catch(e){
    res.status(500).send()
   }
})

router.patch('/users/me',auth,async (req,res)=>{
    const allowedUpdates=['name','email','age','password']
    const updates=Object.keys(req.body)
    const isValid=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send({error:"Invalid updates!"})
    }
    try {
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        // if(!user){
        //     return res.status(404).send()
        // }
        res.send(req.user)

    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete("/users/me",auth,async (req,res)=>{
    try {
        await req.user.deleteOne()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

const upload=multer({
    limits:{
        fileSize:1000000,
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return cb(new Error("image files only"))
        }
        cb(undefined,true)
    }
})

router.post("/users/me/avatar",auth,upload.single('avatar'),async (req,res)=>{
   
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(err,req,res,next)=>{
    res.status(400).send({error:err.message})
})

router.delete("/users/me/avatar",auth,async (req,res)=>{
    try{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

router.get("/users/:id/avatar",async (req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(500).send()
    }
})

module.exports=router