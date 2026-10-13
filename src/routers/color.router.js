import express from "express";
const router = express.Router();
import { get, getById, create, update, deleteById, statusUpdate } from "../controllers/color.controller.js";
import { protect, authorize } from "../middleware/auth.js";

router.get("/", get);
router.get("/:id", getById);
router.post("/create", protect,authorize("admin", "super_admin"), create);
router.put("/update/:id", protect,authorize("admin", "super_admin") , update);
router.delete("/delete/:id", protect,authorize("admin", "super_admin") , deleteById);
router.patch("/status-update/:id", protect,authorize("admin", "super_admin") , statusUpdate);

export default router;
