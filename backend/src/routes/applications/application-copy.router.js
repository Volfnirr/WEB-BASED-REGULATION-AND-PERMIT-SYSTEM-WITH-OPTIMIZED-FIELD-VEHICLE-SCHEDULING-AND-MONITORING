import express from "express";
import rateLimit from "express-rate-limit";
import { createApplicationCopyController } from "../../controller/applications/application-copy.controller.js";
export function createApplicationCopyRouter(service, authenticate, authorize) {
  const router = express.Router();
  const controller = createApplicationCopyController(service);
  router.use(authenticate, authorize);
  router.use((req, res, next) => {
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });
  const exportLimit = rateLimit({
    windowMs: 60_000,
    limit: 10,
    keyGenerator: (req) => req.user.id,
    message: {
      message: "Please wait a minute before exporting more applications.",
    },
    standardHeaders: "draft-8",
    legacyHeaders: false,
  });
  router.post("/export", exportLimit, controller.bulk);
  router.get("/:id/export", exportLimit, controller.single);
  router.get("/:id", controller.detail);
  return router;
}
