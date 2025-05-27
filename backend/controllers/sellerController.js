    const pool = require("../db");

    const sellerUpload = async (req, res) => {
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
    id
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
        id
        ]
    );

    res.status(201).json({ message: "Product inserted successfully." });

    } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
    }

    

    };

    module.exports = { sellerUpload };
