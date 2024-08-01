import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useInventory } from "./InventoryContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useApi } from "./apiService";

const Inventory = () => {
  const api = useApi();
  const { inventory, refreshInventory, loading } = useInventory();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productHistory, setProductHistory] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleViewClick = async (productId) => {
    setHistoryLoading(true);
    try {
      const response = await api.get(`producthistories/${productId}/`);
      setProductHistory(response.data);
      setSelectedProduct(inventory.find((product) => product.id === productId));
      setDialogOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
    setProductHistory([]);
  };

  return (
    <Container>
      <h1>Inventory</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/newSale")}
      >
        Create New Sale
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/createProduct")}
        style={{ marginLeft: 16 }}
      >
        Create Product
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/sales")}
        style={{ marginLeft: 16 }}
      >
        Sales
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/reports")}
        style={{ marginLeft: 16 }}
      >
        Reports
      </Button>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.balance}</TableCell>
                  <TableCell>
                    {new Date(product.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(product.updated_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => navigate(`/editProduct/${product.id}`)}
                    >
                      Edit
                    </Button>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewClick(product.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Product History</DialogTitle>
        <DialogContent>
          {historyLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
              <DialogContentText>
                <strong>Product ID:</strong> {selectedProduct?.id}
              </DialogContentText>
              <DialogContentText>
                <strong>Name:</strong> {selectedProduct?.name}
              </DialogContentText>
              <DialogContentText>
                <strong>Description:</strong> {selectedProduct?.description}
              </DialogContentText>
              <Typography variant="h6" gutterBottom>
                Product History Movements
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productHistory.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{movement.id}</TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell>{movement.type}</TableCell>
                      <TableCell>
                        {new Date(movement.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Inventory;
