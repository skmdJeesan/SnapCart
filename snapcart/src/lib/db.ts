import mongoose from "mongoose"

const mongo_url = process.env.MONGO_URL
if(!mongo_url) throw new Error('db error!')

let cached = global.mongoose
if(!cached) cached = global.mongoose = {conn: null, promise : null}

const connectDB = async () => {
  if(cached.conn) return cached.conn
  if(!cached.promise)
    cached.promise = mongoose.connect(mongo_url).then((conn) => conn.connection)
  try {
    const conn = await cached.promise
    return conn
  } catch (error) {console.log(error)}
}

export default connectDB