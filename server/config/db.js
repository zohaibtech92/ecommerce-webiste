import mongoose from 'mongoose';

export default async function connectDB(){
  // MONGO_URI is supported for older local .env files; new installations use
  // the documented MONGODB_URI name.
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if(!mongoUri) throw new Error('MONGODB_URI is not configured.');
  const conn=await mongoose.connect(mongoUri);
  console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  return conn;
}
