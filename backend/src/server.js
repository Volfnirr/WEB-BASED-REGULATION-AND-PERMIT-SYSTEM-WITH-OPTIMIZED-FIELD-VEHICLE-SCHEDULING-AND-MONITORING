import "dotenv/config";
import express from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import { rateLimiter } from "./middleware/rateLimit.js";
import { requireAuthentication } from "./middleware/requireAuthentication.js";
// requireAuthorization to use: requireAuthorization(role)
// role = the required role needed to perform the allowed actions
import { requireAuthorization } from "./middleware/requireAuthorization.js";
// import servicesRoutes from "./routes/service.routes.js";
import serviceRoutes from "./routes/service.routes.js";
const app = express();

const PORT = 5000;

console.log("NODE_ENV is:", process.env.NODE_ENV);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(rateLimiter);
app.use(express.json());
//Routes here
//Example
// app.use("/api/users", router);
app.use(
  "/api/v1",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  serviceRoutes,
);
app.listen(PORT, () => {
  console.log(`Server started PORT ${PORT}`);
});
