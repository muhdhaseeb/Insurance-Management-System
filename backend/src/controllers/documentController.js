import Document from "../models/Document.js";
import fs from "fs";
import path from "path";

export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const { relatedTo, relatedId } = req.body;

        if (!relatedTo || !relatedId) {
            // Clean up uploaded file if validation fails
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: "relatedTo and relatedId are required"
            });
        }

        const document = await Document.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadedBy: req.user.id,
            relatedTo,
            relatedId
        });

        res.status(201).json({ success: true, data: document });
    } catch (err) {
        // Clean up file if database operation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id).populate("uploadedBy", "name email");

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        // Check permissions: owner or admin
        if (document.uploadedBy._id.toString() !== req.user.id && req.user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        res.json({ success: true, data: document });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        // Check permissions
        if (document.uploadedBy.toString() !== req.user.id && req.user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        // Delete physical file
        if (fs.existsSync(document.path)) {
            fs.unlinkSync(document.path);
        }

        // Delete database record
        await Document.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Document deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getUserDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ uploadedBy: req.user.id }).sort({ uploadedAt: -1 });
        res.json({ success: true, data: documents });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
