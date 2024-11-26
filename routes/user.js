const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signin", async (req, res , next) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndgentoken(email, password);
    return res.cookie("Token", token).redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Incorrect email/password" });
  }
});

router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  await User.create({
    fullname,
    email,
    password,
  });
  return res.redirect("/user/signin");
});

router.get('/logout',(req,res)=>{
  res.clearCookie("Token").redirect('/');
})

module.exports = router;
