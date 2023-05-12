import jwt from "jsonwebtoken";

const fetchuser = (req, res, next) => {
  try {
    const token = req.headers['auth-token'].trim();
    if (!token) {
      const error = new Error("Please re-login");
      error.code = 400;
      throw error;
    }
    console.log(token);
    let data = jwt.verify(token,process.env.JWT_SECRET);
    console.log(data);
    req.user = data.user;
    next();
  } catch (err) {
    const message = err.message || "internal server error";
    const code = err.code || 500;
    res.json({ success: false, message }, code);
  }
};

export default fetchuser;
