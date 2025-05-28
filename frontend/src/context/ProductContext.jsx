// src/context/ProductContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { fetchFilteredProducts } from "../services/api";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category_id: null,
    car_id: null,
    min_price: null,
    max_price: null,
    condition: null,
    seller_id: null,
    compatible_only: false,
    sort_by: "newest",
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    total_pages: 1,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, meta } = await fetchFilteredProducts(filters);
      setProducts(data);
      setPagination({
        total: meta.total,
        total_pages: meta.total_pages,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const updateFilter = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const changePage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        filters,
        pagination,
        updateFilter,
        changePage,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
