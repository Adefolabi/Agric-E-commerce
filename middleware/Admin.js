// authenticate user is am admin
const Admin = async (req, res, next) => {
  console.log("User Info:", req.user);

  if (!req.user || req.user.Role !== "Admin")
    return res.status(403).json({ message: "Access denied. Admins only." });
  next();
};

module.exports = Admin;
