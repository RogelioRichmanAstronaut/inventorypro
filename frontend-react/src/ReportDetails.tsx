import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  CircularProgress,
  Typography,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4F00",
];

const ReportDetails = () => {
  const { reportId } = useParams();
  const api = useApi();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`salesreports/${reportId}/`);
        setReport(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [api, reportId]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Report Details
      </Typography>
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
        report && (
          <>
            <Typography variant="h6" gutterBottom>
              Start Date: {new Date(report.start_date).toLocaleString()}
            </Typography>
            <Typography variant="h6" gutterBottom>
              End Date: {new Date(report.end_date).toLocaleString()}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Total Amount: ${report.total_amount}
            </Typography>
            <PieChart width={400} height={400}>
              <Pie
                data={report.items}
                dataKey="percentage"
                nameKey="product_name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {report.items.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
            <TableContainer component={Paper} style={{ marginTop: 16 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Total Quantity</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.total_quantity}</TableCell>
                      <TableCell>${item.total_amount}</TableCell>
                      <TableCell>{item.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )
      )}
    </Container>
  );
};

export default ReportDetails;
