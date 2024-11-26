const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createToken } = require("../services/authservice");

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }
  const salt = randomBytes(16).toString();
  const hashedpassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedpassword;

  next();
});

UserSchema.static("matchPasswordAndgentoken", async function (email, password) {
  const user =await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const salt = user.salt;
  const hashedpassword = user.password;

  const userpasshash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedpassword !== userpasshash) throw new Error("incorrect password");
  const token=createToken(user);
  return token;
});

const User = model("user", UserSchema);

module.exports = User;