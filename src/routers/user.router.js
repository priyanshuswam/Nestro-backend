import express from "express";
const router = express.Router();
import {
    login, register, verifyOtp, resendOtp, getProfile,
    logout, forgotPassword, updatePassword,
    createAdminUser, getAllUsers, getNormalUsers, deleteUser
} from "../controllers/user.controller.js";
import { protect, authorize } from "../middleware/auth.js";

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.patch("/update-password", updatePassword);

// Protected routes
router.get("/profile", protect, getProfile);

// Admin user management
router.post("/admin/create", protect, authorize("super_admin"), createAdminUser);
router.get("/admin/users", protect, authorize("super_admin", "admin"), getAllUsers);
router.get("/admin/customers", protect, authorize("super_admin", "admin"), getNormalUsers);
router.delete("/admin/customers/:id", protect, authorize("super_admin", "admin"), deleteUser);

export default router;