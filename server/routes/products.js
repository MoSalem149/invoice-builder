import express from "express";
import { body, validationResult } from "express-validator";
import Product from "../models/Product.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Private
router.get("/", authenticate, async (req, res) => {
  try {
    const { archived } = req.query;
    const filter = { userId: req.user._id };

    if (archived !== undefined) {
      filter.archived = archived === "true";
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private
router.post(
  "/",
  authenticate,
  [
    body("name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Product name is required"),
    body("description")
      .optional()
      .trim(),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("discount")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount must be between 0 and 100"),
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

      const { name, description, price, discount } = req.body;

      const product = new Product({
        userId: req.user._id,
        name,
        description: description || "",
        price,
        discount: discount || 0,
      });

      await product.save();

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while creating product",
      });
    }
  }
);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
router.put(
  "/:id",
  authenticate,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Product name is required"),
    body("description")
      .optional()
      .trim(),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("discount")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount must be between 0 and 100"),
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

      const product = await Product.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating product",
      });
    }
  }
);

// @route   PUT /api/products/:id/archive
// @desc    Archive/unarchive a product
// @access  Private
router.put("/:id/archive", authenticate, async (req, res) => {
  try {
    const { archived } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { archived: archived === true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: `Product ${archived ? "archived" : "unarchived"} successfully`,
      data: product,
    });
  } catch (error) {
    console.error("Archive product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while archiving product",
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
});

export default router;