const db = require("../db");
let unifiedData = null;
exports.unifiedData = async (req, res) => {
  if (unifiedData !== null) {
    res.json(unifiedData);
    return;
  }
  try {
    const [categories, manufacturers, parts] = await Promise.all([
      db.query("SELECT DISTINCT category_name FROM categories"),
      db.query(
        "SELECT DISTINCT company_name AS manufacturer FROM cars ORDER BY company_name"
      ),
      db.query(
        "SELECT category_name, GROUP_CONCAT(DISTINCT part_name ORDER BY part_name) as parts FROM categories GROUP BY category_name"
      ),
    ]);

    const processedData = {
      categories: categories[0].map((row) => row.category_name),
      manufacturers: manufacturers[0].map((row) => row.manufacturer),
      partsByCategory: parts[0].reduce((acc, row) => {
        acc[row.category_name] = row.parts.split(",");
        return acc;
      }, {}),
    };

    const [modelsData] = await db.query(
      "SELECT company_name as manufacturer, GROUP_CONCAT(DISTINCT car_name ORDER BY car_name) as models FROM cars GROUP BY company_name"
    );

    processedData.modelsByManufacturer = modelsData.reduce((acc, row) => {
      acc[row.manufacturer] = row.models.split(",");
      return acc;
    }, {});

    const [yearsData] = await db.query(
      "SELECT company_name as manufacturer, car_name as model, GROUP_CONCAT(DISTINCT CONCAT(start_year, '-', IFNULL(end_year, '')) ORDER BY start_year) as years FROM cars GROUP BY company_name, car_name"
    );

    processedData.yearsByModel = yearsData.reduce((acc, row) => {
      if (!acc[row.manufacturer]) {
        acc[row.manufacturer] = {};
      }
      acc[row.manufacturer][row.model] = row.years
        .split(",")
        .map((yearRange) => {
          const [start, end] = yearRange.split("-");
          return { start_year: start, end_year: end || null };
        });
      return acc;
    }, {});
    unifiedData = processedData;
    res.json(unifiedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
