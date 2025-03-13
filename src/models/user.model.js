import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

//User Schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username must be required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true, //for searching and all
    },

    email: {
      type: String,
      required: [true, "Email must be required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    fullName: {
      type: String,
      required: [true, "Fullname must be required"],
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: [true, "password must be required"],
    },

    avatar: {
      type: String, //cloudinary url
      required: true,
    },

    coverImage: {
      type: String, //cloudinary url
      required: true,
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "video",
      },
    ],

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Methods for adding some functions in schema
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },

    process.env.ACCESS_TOKEN_SECRET,

    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },

    process.env.REFRESH_TOKEN_SECRET,

    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
