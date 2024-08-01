import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "./apiService";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useInventory } from "./InventoryContext";

const EditProduct = () => {
  const api = useApi();
  const { refreshInventory } = useInventory();
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`products/${productId}/`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [api, productId]);

  const handleChange = (key, value) => {
    setProduct({ ...product, [key]: value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.put(`products/${productId}/`, product);
      alert("Product updated successfully!");
      await refreshInventory(); // Refresh inventory data
      navigate("/"); // Navigate back to the inventory page
    } catch (error) {
      console.error(error);
      alert("Error updating product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`products/${productId}/`);
      setSnackbarMessage("Product deleted successfully!");
      setSnackbarOpen(true);
      await refreshInventory(); // Refresh inventory data
      navigate("/"); // Navigate back to the inventory page
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error deleting product");
      setSnackbarOpen(true);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Product
      </Typography>
      <Paper style={{ padding: 16 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              value={product.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              disabled={saving || deleting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              value={product.description}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
              disabled={saving || deleting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              type="number"
              value={product.price}
              onChange={(e) => handleChange("price", e.target.value)}
              fullWidth
              disabled={saving || deleting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Balance"
              type="number"
              value={product.balance}
              onChange={(e) => handleChange("balance", e.target.value)}
              fullWidth
              disabled={saving || deleting}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          style={{ marginTop: 16 }}
        >
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              disabled={saving || deleting}
            >
              {saving ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </Grid>
          <Grid item>
            <IconButton
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={saving || deleting}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default EditProduct;
