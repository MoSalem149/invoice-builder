import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/company
// @desc    Get company information
// @access  Private
router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.company,
    });
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching company information",
    });
  }
});

// @route   PUT /api/company
// @desc    Update company information
// @access  Private
router.put(
  "/",
  authenticate,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Company name is required"),
    body("address").optional().trim(),
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("phone").optional().trim(),
    body("currency")
      .optional()
      .isIn(["CHF", "USD", "EGP"])
      .withMessage("Invalid currency")
      .default("CHF"),
    body("language")
      .optional()
      .isIn(["it", "en", "ar"])
      .withMessage("Invalid language")
      .default("it"),
    body("watermark")
      .optional()
      .trim()
      .isLength({ max: 10 })
      .withMessage("Watermark must be 10 characters or less"),
    body("taxRate")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Tax rate must be between 0 and 100"),
    body("showNotes")
      .optional()
      .isBoolean()
      .withMessage("showNotes must be a boolean"),
    body("showTerms")
      .optional()
      .isBoolean()
      .withMessage("showTerms must be a boolean"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const updateData = {};
      const allowedFields = [
        "logo",
        "name",
        "address",
        "email",
        "phone",
        "currency",
        "language",
        "watermark",
        "showNotes",
        "showTerms",
        "taxRate",
      ];

      // Build the update object with company prefix
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateData[`company.${field}`] = req.body[field];
        }
      });

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Company information updated successfully",
        data: user.company,
      });
    } catch (error) {
      console.error("Update company error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating company information",
      });
    }
  }
);

export default router;
