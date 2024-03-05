import mongoose from "mongoose"


const db_connection = async ()=>{
  await mongoose.connect(process.env.DB_CONNECTION)
  .then((_)=> console.log("DB connected successfully"))
  .catch((_)=> console.log('connection error'))
}

export default db_connection 