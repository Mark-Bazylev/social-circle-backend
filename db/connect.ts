import mongoose from 'mongoose'

export default function connectDB (url:string){
  return mongoose.connect(url, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
    // autoIndex: true,
  });
}