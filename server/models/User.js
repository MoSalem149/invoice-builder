import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      set: (email) => {
        // Normalize Gmail addresses by removing dots and everything after +
        if (email.includes("@gmail.com")) {
          const [local, domain] = email.split("@");
          const normalizedLocal = local.replace(/\./g, "").split("+")[0];
          return `${normalizedLocal}@${domain}`.toLowerCase();
        }
        return email.toLowerCase();
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Add company settings directly to user for simplicity
    company: {
      logo: { type: String, default: "/images/default-logo.png" },
      name: { type: String, default: "Said Trasporto Gordola" },
      address: { type: String, default: "Via S.Gottardo 100,\n6596 Gordola" },
      email: { type: String, default: "Info@saidauto.ch" },
      phone: { type: String, default: "" },
      currency: { type: String, enum: ["CHF", "USD", "EGP"], default: "CHF" },
      language: { type: String, enum: ["it", "en", "ar"], default: "it" },
      watermark: { type: String, default: "" },
      showNotes: { type: Boolean, default: false },
      showTerms: { type: Boolean, default: false },
      taxRate: { type: Number, default: 0, min: 0, max: 100 },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);
