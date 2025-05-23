import React, { useEffect, useState } from "react";
import { useProducts } from "../../context/ProductContext";
import axios from "axios";

const CategoryFilter = () => {
  const { filters, updateFilter } = useProducts();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/filtering/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2 text-right">القسم</label>
      <select
        value={filters.category_id || ""}
        onChange={(e) =>
          updateFilter({
            category_id: e.target.value ? parseInt(e.target.value) : null,
          })
        }
        className="w-full p-2 border rounded text-right"
        disabled={loading}
      >
        <option value="">كل الأقسام</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.category_name}
          </option>
        ))}
        {loading && <option disabled>جاري التحميل...</option>}
      </select>
    </div>
  );
};

export default CategoryFilter;
