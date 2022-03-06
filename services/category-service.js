const Category = require("../models/Category");

class CategoryService {
  async delete(id) {
    if (!id) {
      throw new Error("не указан ID");
    }
    const deletedCategory = await Category.findByIdAndDelete(id);
    return deletedCategory;
  }

  async update(category) {
    if (!category._id) {
      throw new Error("не указан ID");
    }
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: category._id },
      category,
      { new: true, runValidators: true }
    );
    return updatedCategory;
  }

  async getAll(user) {
    const categories = await Category.find({ user: user });
    return categories;
  }
}

module.exports = new CategoryService();