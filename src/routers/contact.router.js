import express from "express";
const router = express.Router();
import { sendContact, getContacts, markRead, deleteContact, replyContact } from "../controllers/contact.controller.js";
import { protect, authorize } from "../middleware/auth.js";

router.post("/",            sendContact);
router.get("/",             protect, authorize("admin", "super_admin"), getContacts);
router.patch("/:id/read",   protect, authorize("admin", "super_admin"), markRead);
router.post("/:id/reply",   protect, authorize("admin", "super_admin"), replyContact);
router.delete("/:id",       protect, authorize("admin", "super_admin"), deleteContact);

export default router;
