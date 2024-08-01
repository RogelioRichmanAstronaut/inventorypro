import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "./apiService";
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
  Paper,
  Grid,
} from "@mui/material";

const CreateReport = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post("sales_report/", {
        start_date: startDate,
        end_date: endDate,
      });
      setSnackbarMessage("Report created successfully!");
      setSnackbarOpen(true);
      navigate("/reports"); // Navigate back to the reports page
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error creating report");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Sales Report
      </Typography>
      <Paper style={{ padding: 16 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              disabled={loading}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: 16 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create Report"}
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

export default CreateReport;
