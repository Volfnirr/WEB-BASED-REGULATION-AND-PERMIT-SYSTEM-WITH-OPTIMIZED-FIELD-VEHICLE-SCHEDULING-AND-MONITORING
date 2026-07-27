import "dotenv/config";
import express from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import servicesRoutes from "./routes/service.routes.js";

const app = express();

const PORT = 5000;
console.log("NODE_ENV is:", process.env.NODE_ENV);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
//Routes here
//Example
// app.use("/api/users", router);

app.listen(PORT, () => {
  console.log(`Server started PORT ${PORT}`);
});
