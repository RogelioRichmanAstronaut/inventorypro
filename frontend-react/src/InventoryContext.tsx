import React, { createContext, useState, useEffect, useContext } from "react";
import { useApi } from "./apiService";

const InventoryContext = createContext(null);

export const useInventory = () => {
  return useContext(InventoryContext);
};

export const InventoryProvider = ({ children }) => {
  const api = useApi();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const response = await api.get("products/");
        setInventory(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [api]);

  const refreshInventory = async () => {
    setLoading(true);
    try {
      const response = await api.get("products/");
      setInventory(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InventoryContext.Provider value={{ inventory, refreshInventory, loading }}>
      {children}
    </InventoryContext.Provider>
  );
};
