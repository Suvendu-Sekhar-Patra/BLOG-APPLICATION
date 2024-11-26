const { verifyToken } = require("../services/authservice");

function checkForAuthCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookievalue = req.cookies[cookieName];
    if (!tokenCookievalue) {
      return next();
    }

    try {
      const userpayload = verifyToken(tokenCookievalue);
      req.user = userpayload;
    } catch (error) {}
    return next();
  };
}


module.exports={
    checkForAuthCookie
}
