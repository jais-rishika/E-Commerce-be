const Category = require("../Model/CategoryModel");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: "asc" }).orFail();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const saveAttr = async (req, res, next) => {
  const { key, val, categoryChosen } = req.body;
  if (!key || !val || !categoryChosen) {
    return res.status(400).send("All Inputs Are Required");
  }
  try {
    const category = categoryChosen.split("/")[0];
    const categoryExist = await Category.findOne({
      name: category,
    }).orFail();
    if (categoryExist.attrs.length > 0) {
      let keyDoesNOtExistInDB = true;
      categoryExist.attrs.map((item, idx) => {
        if (item.key === key) {
          keyDoesNOtExistInDB = false;
          let copyAttributeValue = [...categoryExist.attrs[idx].value];
          copyAttributeValue.push(val);
          var newAttributeValues = [...new Set(copyAttributeValue)];
          categoryExist.attrs[idx].value = newAttributeValues;
        }
      });
      if (keyDoesNOtExistInDB) {
        categoryExist.attrs.push({ key, value: [val] });
      }
    } else {
      categoryExist.attrs.push({ key, value: [val] });
    }
    await categoryExist.save();
    let cat = await Category.find({}).sort({ name: "asc" });
    return res.status(201).json({ categoriesUpdated: cat });
  } catch (error) {
    next(error);
  }
};

const newCategory = async (req, res, next) => {
  try {
    const { category } = req.body;
    if (!category) {
      res.status(400).send("Category input is required");
    }
    categoryExists = await Category.findOne({ name: category });
    if (categoryExists) {
      res.status(400).send("Category already Exists");
    } else {
      const categoryCreated = await Category.create({
        name: category,
      });
      res.status(201).send({ categoryCreated: categoryCreated });
    }
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    console.log("hello")
    if (req.params.category !== "choose category") {
      const categoryExists = await Category.findOne({
        name: decodeURIComponent(req.params.category),
      }).orFail();
      await categoryExists.remove();
      res.json({categoryDeleted: true})
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
};
module.exports = { getCategories, saveAttr, newCategory,deleteCategory };
