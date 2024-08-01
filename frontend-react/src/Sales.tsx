import React, { useState, useEffect } from "react";
import { useApi } from "./apiService";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Sales = () => {
  const api = useApi();
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await api.get("sales/");
        setSales(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [api]);

  const handleViewClick = (sale) => {
    setSelectedSale(sale);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSale(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Sales History
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{new Date(sale.date).toLocaleString()}</TableCell>
                  <TableCell>{sale.total_amount}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewClick(sale)}
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
        <DialogTitle>Sale Details</DialogTitle>
        <DialogContent>
          {selectedSale ? (
            <>
              <DialogContentText>
                <strong>Sale ID:</strong> {selectedSale.id}
              </DialogContentText>
              <DialogContentText>
                <strong>Date:</strong>{" "}
                {new Date(selectedSale.date).toLocaleString()}
              </DialogContentText>
              <DialogContentText>
                <strong>Total Amount:</strong> {selectedSale.total_amount}
              </DialogContentText>
              <Typography variant="h6" gutterBottom>
                Sale Items
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedSale.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product_id}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.total_amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <CircularProgress />
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

export default Sales;
