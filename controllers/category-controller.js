const Category = require("../models/Category");
const CategoryService = require("../services/category-service");
const Note = require("../models/Note");

class CategoryController {
  async create(req, res) {
    try {
      const { title, description, color, icon, dataCreated } = req.body;

      const category = new Category({
        user: req.user.id,
        title: title,
        description: description,
        color: color,
        icon: icon,
        dataCreated: dataCreated
      });

      await category.save();
      res.json(category);

    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.body;

      const category = await Category.findOne({
        user: req.user.id,
        _id: id,
      });

      if (category) {
        const deletedCategory = await CategoryService.delete(id);
        await Note.deleteMany({ user: req.user.id, category: id });
        return res.json(deletedCategory);
      } else {
        res.json({ message: "Ошибка при удалении" });
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  async update(req, res) {
    try {
      const category = await Category.findOne({
        user: req.user.id,
        _id: req.body._id,
      });

      if (category) {
        const updatedCategory = await CategoryService.update(req.body);
        res.json(updatedCategory);
      } else {
        res.json({ message: "Ошибка при обновлении" });
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  async getCategoriesList(req, res) {
    try {
      const categories = await CategoryService.getAll(req.user.id);
      res.json(categories);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

module.exports = new CategoryController();