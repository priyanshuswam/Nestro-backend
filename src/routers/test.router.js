import { Router } from "express";
import { 
    testOtpEmail, 
    testContactEmail, 
    testOrderEmail, 
    testBrevoConfig 
} from "../controllers/test.controller.js";
import {
    testConnection,
    testCreate,
    testRead,
    testStats,
    testCleanup
} from "../controllers/database.test.controller.js";

const testRouter = Router();

// Email testing routes
testRouter.post("/email/otp", testOtpEmail);
testRouter.post("/email/contact", testContactEmail);
testRouter.post("/email/order", testOrderEmail);
testRouter.get("/brevo/config", testBrevoConfig);

// Database testing routes
testRouter.get("/db/connection", testConnection);
testRouter.post("/db/create", testCreate);
testRouter.get("/db/read", testRead);
testRouter.get("/db/stats", testStats);
testRouter.delete("/db/cleanup", testCleanup);

export default testRouter;