import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    client: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    terms: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
invoiceSchema.index({ userId: 1, number: 1 });
invoiceSchema.index({ userId: 1, date: -1 });
invoiceSchema.index({ userId: 1, status: 1 });

export default mongoose.model("Invoice", invoiceSchema);
