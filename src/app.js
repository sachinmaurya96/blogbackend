import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//middleWares
const app = express();
app.use(cors());
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use(express.static("public"))

//routers
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/user",userRouter)

export { app };
