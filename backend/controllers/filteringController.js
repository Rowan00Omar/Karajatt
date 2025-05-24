const db = require("../db");

exports.categories = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT DISTINCT category_name FROM categories"
    );
    const categories = rows.map((row) => row.category_name);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.manufacturers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT DISTINCT company_name AS manufacturer FROM cars ORDER BY company_name"
    );
    res.json(rows.map((item) => item.manufacturer));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.models = async (req, res) => {
  try {
    const { manufacturer } = req.query;
    if (!manufacturer) {
      return res.json([]);
    }
    const [rows] = await db.query(
      "SELECT DISTINCT car_name AS model FROM cars WHERE company_name = ? ORDER BY car_name",
      [manufacturer]
    );
    res.json(rows.map((item) => item.model));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.years = async (req, res) => {
  try {
    const { manufacturer, model } = req.query;
    const [rows] = await db.query(
      "SELECT DISTINCT start_year,end_year from cars WHERE company_name = ? AND car_name = ? ",
      [manufacturer, model]
    );
    res.json(
      rows.map((item) => ({
        start_year: item.start_year,
        end_year: item.end_year,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.parts = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.json([]);
    }
    const [rows] = await db.query(
      "SELECT DISTINCT part_name as part FROM categories WHERE category_name = ? ORDER BY part_name",
      [category]
    );
    res.json(rows.map((item) => item.part));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
