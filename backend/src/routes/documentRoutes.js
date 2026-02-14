import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
    uploadDocument,
    getDocument,
    deleteDocument,
    getUserDocuments
} from "../controllers/documentController.js";
import { validateObjectId } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/my-documents", getUserDocuments);
router.get("/:id", validateObjectId, getDocument);
router.delete("/:id", validateObjectId, deleteDocument);

export default router;
