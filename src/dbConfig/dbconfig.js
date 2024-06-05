import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default dbConnect;






// import mongoose from "mongoose";

// export const connect = async () => {
//     const MONGODB_URI = process.env.MONGODB_URI!;

//     if (!MONGODB_URI) {
//         throw new Error(
//             "Please define the MONGODB_URI environment variable",
//         );
//     }

//     try {
//         if (mongoose.connections[0].readyState === 1) {
//             return;
//         }

//         await mongoose.connect(MONGODB_URI);
//         const connection = mongoose.connection;

//         connection.on("connected", () => {
//             console.log("MongoDB database connection established successfully");
//         });

//         connection.on("error", (error: any) => {
//             console.log("Mongo DB Connection Error:", error);
//             process.exit(1);
//         });

//     } catch (error) {
//         console.log("Something went wrong while connection to the Mongo DB: ", error);
//     }
// }
