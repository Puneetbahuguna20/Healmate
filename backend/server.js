import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/mongodb.js'
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/usersRoute.js';

// app.use("/api/admin", adminRoutes);


// Load environment variables from project root .env (with safe fallback)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootEnvPath = path.resolve(__dirname, '../.env')

// Try root .env first
dotenv.config({ path: rootEnvPath })
// Fallback to backend/.env if root variables are missing
if (!process.env.JWT_SECRET) {
  dotenv.config()
}

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary();

// middleware
app.use(express.json())
// app.use(bodyParser.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));



// api endpoints
app.use("/api/admin", adminRouter); // ✅ Base path


// // localhost:5000/api/admin/add-doctor

app.use('/api/doctor', doctorRouter)
app.use('/api/user' , userRouter)

app.get('/' ,(req,res)=>{
    res.send('API WORKING ')
})

app.use((req, res, next) => {
    console.log("❌ Route not found:", req.method, req.originalUrl);
    res.status(404).json({ error: "Route not found" });
  });
  
app.listen(port, ()=> console.log("Server Started" , port ) )