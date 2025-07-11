import express from "express";
import { body, validationResult } from "express-validator";
import Client from "../models/Client.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/clients
// @desc    Get all clients
// @access  Private
router.get("/", authenticate, async (req, res) => {
  try {
    const { archived } = req.query;
    const filter = { userId: req.user._id };

    if (archived !== undefined) {
      filter.archived = archived === "true";
    }

    const clients = await Client.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    console.error("Get clients error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching clients",
    });
  }
});

// @route   POST /api/clients
// @desc    Create a new client
// @access  Private
router.post(
  "/",
  authenticate,
  [
    body("name").trim().notEmpty().withMessage("Client name is required"),
    body("address").optional().trim(),
    body("phone").optional().trim(),
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

      const { name, address, phone } = req.body;

      const client = new Client({
        userId: req.user._id,
        name,
        address: address || "",
        phone: phone || "",
      });

      await client.save();

      res.status(201).json({
        success: true,
        message: "Client created successfully",
        data: client,
      });
    } catch (error) {
      console.error("Create client error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while creating client",
      });
    }
  }
);

// @route   PUT /api/clients/:id
// @desc    Update a client
// @access  Private
router.put(
  "/:id",
  authenticate,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Client name cannot be empty"),
    body("address").optional().trim(),
    body("phone").optional().trim(),
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

      const client = await Client.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }

      res.json({
        success: true,
        message: "Client updated successfully",
        data: client,
      });
    } catch (error) {
      console.error("Update client error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating client",
      });
    }
  }
);

// @route   PUT /api/clients/:id/archive
// @desc    Archive/unarchive a client
// @access  Private
router.put("/:id/archive", authenticate, async (req, res) => {
  try {
    const { archived } = req.body;

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { archived: archived === true },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      message: `Client ${archived ? "archived" : "unarchived"} successfully`,
      data: client,
    });
  } catch (error) {
    console.error("Archive client error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while archiving client",
    });
  }
});

// @route   PATCH /api/clients/:id
// @desc    Edit a client (partial update)
// @access  Private
router.patch(
  "/:id",
  authenticate,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Client name cannot be empty"),
    body("address").optional().trim(),
    body("phone").optional().trim(),
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

      const client = await Client.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }

      res.json({
        success: true,
        message: "Client edited successfully",
        data: client,
      });
    } catch (error) {
      console.error("Edit client error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while editing client",
      });
    }
  }
);

export default router;
