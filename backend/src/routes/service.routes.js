import express from "express";

//example lol tulog
const router = express.Router();

router.get(
  "/:serviceId/applications",
  authenticate,
  requireServiceAccess(),
  (req, res) => {
    res.json({
      message: "Applications loaded",
    });
  },
);
router.get("/test", authenticate, (req, res) => {
  res.json({
    message: "Hello",
    user: req.user,
  });
});
export default router;
