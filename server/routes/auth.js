import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
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

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        company: {
          logo: "/images/default-logo.png",
          name: "Said Trasporto Gordola",
          address: "Via S.Gottardo 100,\n6596 Gordola",
          email: "Info@saidauto.ch",
          phone: "",
          currency: "CHF",
          language: "it",
          watermark: "",
          showNotes: false,
          showTerms: false,
          taxRate: 0,
        },
      });
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password").exists().withMessage("Password is required"),
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

      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email });
      if (!user || !user.isActive) {
        console.log("User not found or inactive:", {
          email,
          userExists: !!user,
          isActive: user?.isActive,
        });
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      console.log("Password validation:", { isPasswordValid, email });
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: user.toJSON(),
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  }
);

// @route   POST /api/auth/verify-email
// @desc    Verify email for password reset
router.post(
  "/verify-email",
  [body("email").isEmail().withMessage("Please provide a valid email")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Normalize email
      let email = req.body.email.toLowerCase();
      if (email.includes("@gmail.com")) {
        const [local, domain] = email.split("@");
        email = `${local.replace(/\./g, "").split("+")[0]}@${domain}`;
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found with that email",
        });
      }

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   POST /api/auth/reset-password
// @desc    Reset password
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Normalize email
      let email = req.body.email.toLowerCase();
      if (email.includes("@gmail.com")) {
        const [local, domain] = email.split("@");
        email = `${local.replace(/\./g, "").split("+")[0]}@${domain}`;
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found with that email",
        });
      }

      // Set new password
      user.password = req.body.newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", authenticate, async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  authenticate,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
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

      const { name, email } = req.body;
      const updates = {};

      if (name) updates.name = name;
      if (email) {
        // Check if email is already taken by another user
        const existingUser = await User.findOne({
          email,
          _id: { $ne: req.user._id },
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Email already in use",
          });
        }
        updates.email = email;
      }

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
      });

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during profile update",
      });
    }
  }
);

export default router;
