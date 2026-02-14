import { body, param, validationResult } from "express-validator";

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};

// User validation rules
export const validateUserRegistration = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["ADMIN", "AGENT", "CUSTOMER"]).withMessage("Invalid role"),
    handleValidationErrors
];

export const validateUserUpdate = [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("phone").optional().trim(),
    body("age").optional().isInt({ min: 18, max: 120 }).withMessage("Age must be between 18 and 120"),
    body("occupation").optional().trim(),
    body("address").optional().trim(),
    handleValidationErrors
];

// Policy validation rules
export const validatePolicyCreation = [
    body("name").trim().notEmpty().withMessage("Policy name is required"),
    body("type").isIn(["HEALTH", "LIFE", "TRAVEL", "AUTO"]).withMessage("Invalid policy type"),
    body("coverage").isNumeric().withMessage("Coverage amount must be a number"),
    body("premium").isNumeric().withMessage("Premium must be a number"),
    body("durationYears").optional().isInt({ min: 1 }).withMessage("Duration must be at least 1 year"),
    handleValidationErrors
];

export const validatePolicyUpdate = [
    body("status").optional().isIn(["PENDING", "ACTIVE", "CANCELLED"]).withMessage("Invalid status"),
    body("paymentStatus").optional().isIn(["PAID", "UNPAID", "OVERDUE"]).withMessage("Invalid payment status"),
    handleValidationErrors
];

// Claim validation rules
export const validateClaimCreation = [
    body("policyId").notEmpty().withMessage("Policy ID is required"),
    body("amount").isNumeric().withMessage("Claim amount must be a number"),
    body("incidentDate").isISO8601().withMessage("Valid incident date is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    handleValidationErrors
];

export const validateClaimReview = [
    body("status").isIn(["APPROVED", "REJECTED", "PAID"]).withMessage("Invalid claim status"),
    handleValidationErrors
];

// Payment validation rules
export const validatePaymentCreation = [
    body("policyId").notEmpty().withMessage("Policy ID is required"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
    handleValidationErrors
];

// ID parameter validation
export const validateObjectId = [
    param("id").isMongoId().withMessage("Invalid ID format"),
    handleValidationErrors
];

export const validatePolicyIdParam = [
    param("policyId").isMongoId().withMessage("Invalid Policy ID format"),
    handleValidationErrors
];
