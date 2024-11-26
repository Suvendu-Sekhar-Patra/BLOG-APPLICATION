require('dotenv').config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");
const { checkForAuthCookie } = require("./middlewear/auth");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("connected to mongoDB"));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthCookie("Token"));

const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.resolve('./public')));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({createdAt : -1});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
