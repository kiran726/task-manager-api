const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const Task=require("../models/task")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error("Age can't be a negative number")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("Password can't contain the word password")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},
{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.statics.findByCredentials =async (email,password) =>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error("Unable to Login")
    }
    const isMatched=await bcrypt.compare(password,user.password)
    if(!isMatched){
        throw new Error("Unable to Login")
    }
    return user
}

userSchema.pre('save',async function (next) {
    const user=this
    
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }

    next()
})

userSchema.pre('deleteOne', { document : true , query : false },async function (next){

    // console.log(this)
    await Task.deleteMany({owner:this._id})
    next()

})

userSchema.methods.generateAuthToken = async function() {
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.methods.toJSON = function() {
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
const User=mongoose.model('User',userSchema)

module.exports=User