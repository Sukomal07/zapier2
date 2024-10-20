import { Router } from "express";
import { createZap, getZap, getZaps } from "../controllers/zap.controller";
import { authMiddleware } from "../middleware";

const router = Router();

router.post("/newzap", authMiddleware, createZap)
router.get("/:userId/zaps", authMiddleware, getZaps)
router.get("/:userId/:zapId", authMiddleware, getZap)


export const zapRoutes = router;