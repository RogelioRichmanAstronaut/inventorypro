import React, { useState, useEffect } from "react";
import { useApi } from "./apiService.ts";
import {
  Container,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useInventory } from "./InventoryContext.tsx";

const NewSale = () => {
  const api = useApi();
  const { inventory, refreshInventory } = useInventory();
  const [items, setItems] = useState([
    { product_id: "", quantity: "", total_amount: 0 },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleItemChange = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = value;

    if (key === "quantity" || key === "product_id") {
      const product = inventory.find(
        (product) => product.id === parseInt(updatedItems[index].product_id)
      );
      if (product) {
        updatedItems[index].total_amount =
          product.price * parseInt(updatedItems[index].quantity || 0);
      }
    }

    setItems(updatedItems);
    setTotalAmount(
      updatedItems.reduce((sum, item) => sum + item.total_amount, 0)
    );
  };

  const handleAddItem = () => {
    setItems([...items, { product_id: "", quantity: "", total_amount: 0 }]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const saleData = {
      total_amount: totalAmount,
      user_id: 1,
      items: items.map((item) => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity),
        total_amount: item.total_amount,
      })),
    };

    try {
      await api.post("sales/", saleData);
      alert("Sale created successfully!");
      await refreshInventory(); // Refresh inventory data
      navigate("/"); // Navigate back to the inventory page
    } catch (error) {
      console.error(error);
      alert("Error creating sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create New Sale
      </Typography>
      <Paper style={{ padding: 16 }}>
        {items.map((item, index) => (
          <Grid container spacing={2} key={index}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Product"
                value={item.product_id}
                onChange={(e) =>
                  handleItemChange(index, "product_id", e.target.value)
                }
                fullWidth
                disabled={loading}
              >
                {inventory.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                fullWidth
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Total Amount"
                type="number"
                value={item.total_amount}
                disabled
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddItem}
          style={{ marginTop: 16 }}
          disabled={loading}
        >
          Add Item
        </Button>
        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          Total Amount: ${totalAmount.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          style={{ marginTop: 16 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Sale"}
        </Button>
      </Paper>
    </Container>
  );
};

export default NewSale;
