import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "./apiService";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { useInventory } from "./InventoryContext";

const CreateProduct = () => {
  const api = useApi();
  const { refreshInventory } = useInventory();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    balance: "",
  });
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (key, value) => {
    setProduct({ ...product, [key]: value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.post("products/", {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        balance: parseInt(product.balance, 10),
      });
      setSnackbarMessage("Product created successfully!");
      setSnackbarOpen(true);
      await refreshInventory(); // Refresh inventory data
      navigate("/"); // Navigate back to the inventory page
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error creating product");
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Product
      </Typography>
      <Paper style={{ padding: 16 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              value={product.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              value={product.description}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              type="number"
              value={product.price}
              onChange={(e) => handleChange("price", e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Balance"
              type="number"
              value={product.balance}
              onChange={(e) => handleChange("balance", e.target.value)}
              fullWidth
              disabled={saving}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: 16 }}
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : "Create Product"}
        </Button>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default CreateProduct;
