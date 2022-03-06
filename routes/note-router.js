const router = require("express").Router();
const noteController = require("../controllers/note-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/", authMiddleware, noteController.create);
router.delete("/delete", authMiddleware, noteController.delete);
router.put("/update", authMiddleware, noteController.update);
router.get("/all", authMiddleware, noteController.getAllNotes);
router.get("/note", authMiddleware, noteController.getNote);
router.get("/categorysort", authMiddleware, noteController.getNotesCategorySort);
router.get("/basket", authMiddleware, noteController.getNotesBasket);
router.get("/search", authMiddleware, noteController.searchNote);
router.get("/archive", authMiddleware, noteController.getArchiveNotes);
router.get("/category", authMiddleware, noteController.getCategoryNotes);

module.exports = router;