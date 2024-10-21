import express from "express"
import { zapRoutes } from "./routes/zap.routes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
app.use("/api/v1/zap", zapRoutes)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})