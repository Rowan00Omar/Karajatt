const pool = require("../db");

exports.sellerUpload = async (req, res) => {
  const {
    manufacturer,
    model,
    startYear,
    endYear,
    category,
    part,
    status,
    numberOfParts,
    title,
    extraDetails,
    timeInStock,
    price,
    condition,
    id,
  } = req.body;

  try {
    const [categoryRows] = await pool.query(
      "SELECT id FROM categories WHERE category_name = ?",
      [category.trim()]
    );

    if (categoryRows.length === 0) {
      return res.status(400).json({ error: "Invalid category name." });
    }

    const category_id = categoryRows[0].id;
    await pool.query(
      `INSERT INTO products (
        company_name, car_name, start_year, end_year, category_id, part_name, status, parts_in_stock,
        title, description, storage_duration, price,\`condition\`,seller_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
      [
        manufacturer.trim(),
        model.trim(),
        startYear,
        endYear,
        category_id,
        part.trim(),
        status.trim(),
        numberOfParts,
        title.trim(),
        extraDetails.trim(),
        timeInStock,
        price,
        condition.trim(),
        id,
      ]
    );

    res.status(201).json({ message: "Product inserted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { manufacturer, model, year, category, part } = req.query;
    console.log("Received filters:", {
      manufacturer,
      model,
      year,
      category,
      part,
    });

    let categoryId = null;
    if (category) {
      const [categoryRows] = await pool.query(
        "SELECT id FROM categories WHERE category_name = ?",
        [category]
      );
      categoryId = categoryRows[0]?.id || null;
    }

    let query = `
      SELECT 
        p.product_id,
        p.company_name AS manufacturer,
        p.car_name AS model,
        p.part_name,
        p.price,
        p.description,
        p.start_year,
        p.end_year,
        p.image_url,
        p.condition,
        p.storage_duration,
        p.rating,
        p.review_count,
        c.category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;

    const params = [];

    if (manufacturer) {
      query += ` AND p.company_name = ?`;
      params.push(manufacturer);
    }

    if (model) {
      query += ` AND p.car_name = ?`;
      params.push(model);
    }

    if (year) {
      query += ` AND ? BETWEEN p.start_year AND IFNULL(p.end_year, p.start_year)`;
      params.push(year);
    }

    if (categoryId) {
      query += ` AND p.category_id = ?`;
      params.push(categoryId);
    }

    if (part) {
      query += ` AND p.part_name = ?`;
      params.push(part);
    }

    query += ` ORDER BY p.created_at DESC`;

    console.log("Final query:", query);
    console.log("Query parameters:", params);

    const [products] = await pool.query(query, params);
    console.log(`Found ${products.length} products`);

    res.json(products);
  } catch (err) {
    console.error("Database error:", err.message);
    console.error("Full error stack:", err.stack);
    res.status(500).json({
      error: "Database query failed",
      details: err.message,
    });
  }
};
