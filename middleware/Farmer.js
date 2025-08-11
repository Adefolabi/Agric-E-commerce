// authenticate user is am admin
const Farmer = async (req, res, next) => {
  if (!req.user || req.user.role !== "Admin" || req.user.role !== "admin")
    return res
      .status(403)
      .json({ message: "Access denied. Farmers and Admins only." });
  next();
};

module.exports = Farmer;
