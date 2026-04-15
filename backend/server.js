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
const backendEnvPath = path.resolve(__dirname, './.env')

// Load root .env first
dotenv.config({ path: rootEnvPath })
// Then load backend/.env to fill any missing values without overriding existing ones
dotenv.config({ path: backendEnvPath })

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary();

// Ensure JWT secret exists in development to avoid login failures
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dev_secret_key_change_me';
  console.warn('⚠️ JWT_SECRET not set. Using a dev fallback secret. Set JWT_SECRET in your .env for production.')
}

// middleware
app.use(express.json())
// app.use(bodyParser.json());
// CORS: allow frontend origins and custom headers used by the app
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5178'
].filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g., curl, Postman) with no origin
    if (!origin) return callback(null, true)

    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    if (isLocalhost || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(null, false)
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Allow custom auth headers used by the app
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken', 'dtoken', 'x-api-key'],
  credentials: true,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
// Preflight for all routes (Express 5 + path-to-regexp v6 requires named wildcard)
app.options('/*splat', cors(corsOptions))
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



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
