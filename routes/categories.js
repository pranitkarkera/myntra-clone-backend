const express = require('express')
const Category = require('../models/categories.models')
const router = express.Router()

const newCategories = [
  {
    categoryId: "678903d96080288c4dcc1b4d", // Printed Shirt
    categoryName: "Printed Shirt",
  },
  {
    categoryId: "678903d96080288c4dcc1b4e", // Checked Shirt
    categoryName: "Checked Shirt",
  },
  {
    categoryId: "678903d96080288c4dcc1b4f", // Solid Shirt
    categoryName: "Solid Shirt",
  },
  {
    categoryId: "678903d96080288c4dcc1b50", // Floral Shirt
    categoryName: "Floral Shirt",
  },
  {
    categoryId: "678903d96080288c4dcc1b51", // Denim Shirt
    categoryName: "Denim Shirt",
  },
  {
    categoryId: "678903d96080288c4dcc1b52", // Cotton Shirt
    categoryName: "Cotton Shirt",
  },
  {
    categoryId: "678903d96080288c4dcc1b53", // Printed Top
    categoryName: "Printed Top",
  },
  {
    categoryId: "678903d96080288c4dcc1b54", // Striped Top
    categoryName: "Striped Top",
  },
  {
    categoryId: "678903d96080288c4dcc1b55", // Solid Top
    categoryName: "Solid Top",
  },
  {
    categoryId: "678903d96080288c4dcc1b56", // Floral Top
    categoryName: "Floral Top",
  },
  {
    categoryId: "678903d96080288c4dcc1b57", // Dusty Top
    categoryName: "Dusty Top",
  },
];

// post categories in th database

async function createCategory(categories) {
    try {
        const savedCategories = await Category.insertMany(categories);
        return savedCategories;
    } catch (error) {
        throw error
    }
}

router.post('categories', async (req, res) => {
    try{
        console.log(req.body)
        const savedCategories = await createCategory(req.body)
        res.status(200).json({message: "New category created", savedCategories})
    }catch(error){
        res.status(500).json({Error: "Failed to create a category"})
    }
})

//get categories from the database

async function readAllCategories() {
    try {
        const allCategory = await Category.find()
        return allCategory
    } catch (error) {
        throw error
    }
}


router.get("/", async (req, res) => {
  try {
    const categories = await readAllCategories();
    if (categories.length != 0) {
      res.json({ data: { categories } });
    } else {
      res.status(404).json({ error: "Categories not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

//get categories by Id

async function getCategoriesById(categoryId) {
    try{
        const categoriesById = await Category.findById(categoryId)
        return categoriesById
    }catch(error){
        throw error
    }
}

router.get('/:categoryId', async (req, res) => {
    try {
        const category = await getCategoriesById(req.params.categoryId);
        if(category){
            res.json({ data: { category } });
        }else{
            res.status(404).json({error: "Category by id not found"})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch category by id"})
    }
})

createCategory(newCategories);

module.exports = router