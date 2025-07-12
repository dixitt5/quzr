import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from './routes/answerRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import tagRoutes from "./routes/tagRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/votes', voteRoutes);
app.use("/api/tags", tagRoutes);

app.get("/", (req, res) => {
  res.send("Quzr Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
