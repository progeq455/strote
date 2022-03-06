const router = require("express").Router();
const categoryController = require("../controllers/category-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/", authMiddleware, categoryController.create);
router.put("/update", authMiddleware, categoryController.update);
router.delete("/delete", authMiddleware, categoryController.delete);
router.get("/list", authMiddleware, categoryController.getCategoriesList);

module.exports = router; 