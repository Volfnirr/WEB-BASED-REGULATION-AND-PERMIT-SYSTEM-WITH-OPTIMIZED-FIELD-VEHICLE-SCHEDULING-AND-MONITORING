import "dotenv/config";
import express from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import { rateLimiter } from "./middleware/rateLimit.js";
// import { requireAuthentication } from "./middleware/requireAuthentication.js";
// // This is for requireAuthorization
// // Important: use after requireAuthentication
// // requireAuthorization to use: requireAuthorization(role)
// // role = the required role needed to perform the allowed actions
// import { requireAuthorization } from "./middleware/requireAuthorization.js";
// // This is for requireAppAdminServices
// // Important: user after requireAuthentication a nd requireAuthorization
// // requireAppAdminServices to use: requireAuthorization([1,2])
// // service = add required service for that action
// // services are
// // 1 = Agricultural Free Patent,
// // 2 = Residential Free Patent,
// // 3 = Tree Cutting Permit,
// // 4 = Chainsaw Registration
// import { requireAppAdminServices } from "./middleware/requireAppAdminServices.js";
import serviceRoutes from "./routes/service.routes.js";
import treeCuttingRoutes from "./routes/applications/tree-cutting.routes.js";
import residentialRoutes from "./routes/applications/residential.routes.js";
import userApplicationStatus from "./routes/applications/application-status.routes.js";
import applicationAdminRoutes from "./routes/applications/admin.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

console.log("NODE_ENV is:", process.env.NODE_ENV);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(rateLimiter);
app.use(express.json());
//Routes here
//Example
// app.use("/api/users", router);

app.use("/api/v1", serviceRoutes);

app.use("/api/v1/applications", treeCuttingRoutes);

app.use("/api/v1/applications", residentialRoutes);

app.use("/api/v1/applications", userApplicationStatus);

app.use("/api/v1/applications", applicationAdminRoutes);

app.listen(PORT, () => {
  console.log(`Server started PORT ${PORT}`);
});
