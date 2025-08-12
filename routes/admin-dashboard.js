const express = require("express");
const router = express.Router();
const { validateUpdateUser } = require("../models/users");
const AUTH = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
const validate = require("../middleware/Validate");
const {
  searchUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getUser,
  updateUserRoleStatus,
} = require("../controllers/user");
const {
  validateProduct,
  validateUpdateProduct,
} = require("../models/Products");
const {
  createProduct,
  getProduct,
  searchProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} = require("../controllers/product");
const {
  updateCategory,
  deleteCategory,
  createCategory,
} = require("../controllers/category");
const {
  validateUpdateCategory,
  validateCategory,
} = require("../models/categories");
const {
  deleteSingleSubcategory,
  updateSubcategory,
  getSingleSubcategory,
  getSubcategory,
  createSubcategory,
} = require("../controllers/subcategory");
const {
  validateUpdateSubcategory,
  validateSubcategory,
} = require("../models/Subcategories");
const { dashboardOverview } = require("../controllers/admin-dashboard");
const {  getOrderHistory, adminGetAllOrders, getOrder } = require("../controllers/order");

// DASHBOARD OVERVIEW
router.get("/dashboard", AUTH, Admin, dashboardOverview);

// USER MANAGEMENT
// get users
router.get("/", AUTH, Admin, getUser);
// search User
router.get("/user/search", AUTH, Admin, searchUser);
// get specific user
router.get("/user/:id", AUTH, Admin, getSingleUser);
// update user
router.put("/user/:id", AUTH, Admin, validate(validateUpdateUser), updateUser);
// delete user
router.delete("/user/:id", AUTH, Admin, deleteUser);
// modify user role
router.put(
  "/role/:id",
  AUTH,
  Admin,
  validate(validateUpdateUser),
  updateUserRoleStatus
);
// modify user status
router.put(
  "/status/:id",
  AUTH,
  Admin,
  validate(validateUpdateUser),
  updateUserRoleStatus
);



// ORDER MANAGEMENT
router.get("/", AUTH, Admin, adminGetAllOrders);
router.get("/:id", AUTH, Admin, getOrder);
router.get("/Admin/:id", AUTH, Admin, getOrderHistory);

// PRODUCT MANAGEMENT
// create product
router.post(
  "/product/add",
  AUTH,
  Admin,
  validate(validateProduct),
  createProduct
);
// get all product
router.get("/product", AUTH, getProduct);
// search product
router.get("/product/search", searchProduct);
// get single product
router.get("/product/:id", AUTH, getSingleProduct);
// update
router.put(
  "/product/:id",
  AUTH,
  Admin,
  validate(validateUpdateProduct),
  updateProduct
);
// delete product
router.delete("/product/:id", AUTH, Admin, deleteProduct);

// CATEGORY MANAGEMENT
// create categories
router.post(
  "/category",
  AUTH,
  Admin,
  validate(validateCategory),
  createCategory
);
// update
router.put(
  "/category/:id",
  AUTH,
  Admin,
  validate(validateUpdateCategory),
  updateCategory
);
// delete categories
router.delete("/category/:id", AUTH, Admin, deleteCategory);

// SUBCATEGORY MANAGEMENT
// create subcategories
router.post(
  "/subcategory/",
  AUTH,
  Admin,
  validate(validateSubcategory),
  createSubcategory
);
// get all subcategories
router.get("/subcategory/", AUTH, getSubcategory);
// get single subcategories
router.get("/subcategory/:id", AUTH, getSingleSubcategory);
// update
router.put(
  "/subcategory/:id",
  AUTH,
  Admin,
  validate(validateUpdateSubcategory),
  updateSubcategory
);
// delete subcategories
router.delete("/subcategory/:id", AUTH, Admin, deleteSingleSubcategory);

module.exports = router;
