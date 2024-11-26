const JWT = require("jsonwebtoken");

const secret = "$uperman@123";

function createToken(user) {
  const payload = {
    _id: user._id,
    fullname:user.fullname,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = JWT.sign(payload, secret, { expiresIn: "1h" });
  return token;
}

function verifyToken(token) {
  try {
    const payload = JWT.verify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

module.exports={
    createToken,
    verifyToken
}