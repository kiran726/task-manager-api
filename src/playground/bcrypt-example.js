const bcrypt=require("bcryptjs")
async function fun() {
const hashed= await bcrypt.hash("asbcdfkf",8)
console.log(hashed)
}
fun()