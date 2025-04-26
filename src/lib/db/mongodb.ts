import mongoose from 'mongoose';

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI || process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Define the type for the mongoose cache
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Add mongoose to global to prevent multiple connections
declare global {
  var mongooseCache: MongooseCache;
}

// Initialize cache
global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

async function connectDB() {
  if (global.mongooseCache.conn) {
    console.log('Using existing connection');
    return global.mongooseCache.conn;
  }

  if (!global.mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Creating new connection to MongoDB');
    global.mongooseCache.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose.connection;
      });
  }

  try {
    global.mongooseCache.conn = await global.mongooseCache.promise;
  } catch (e) {
    global.mongooseCache.promise = null;
    console.error('Error connecting to database:', e);
    throw e;
  }

  return global.mongooseCache.conn;
}

export default connectDB;