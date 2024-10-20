import express from "express"
import { zapRoutes } from "./routes/zap.routes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/v1/zap", zapRoutes)


app.listen(3002, () => {
    console.log("Backend running on 3002")
})