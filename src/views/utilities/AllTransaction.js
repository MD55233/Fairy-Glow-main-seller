import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from 'views/pages/authentication/AuthContext';

const TransactionHistory = () => {
  const { username } = useAuth(); // Get username from auth context
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const [
          withdrawalsResponse,
          bonusesResponse,
          approvedResponse,
          rejectedResponse,
          referralResponse,
          approvedReferralResponse,
          rejectedReferralResponse,
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_HOST}/api/withdrawals/${username}`),
          axios.get(`${process.env.REACT_APP_API_HOST}/api/training-bonus/${username}`),
          axios.get(`${process.env.REACT_APP_API_HOST}/api/approvals/approve/${username}`), // Approved bonuses
          axios.get(`${process.env.REACT_APP_API_HOST}/api/approvals/reject/${username}`), // Rejected bonuses
          axios.get(`${process.env.REACT_APP_API_HOST}/api/referral-payment/${username}`), // Referral payments
          axios.get(`${process.env.REACT_APP_API_HOST}/api/approvals/referral/approve/${username}`), // Approved referral payments
          axios.get(`${process.env.REACT_APP_API_HOST}/api/approvals/referral/reject/${username}`), // Rejected referral payments
        ]);

        // Combine all transaction types into a single array
        const combinedTransactions = [
          ...withdrawalsResponse.data.map(item => ({ ...item, type: 'Withdrawal' })),
          ...bonusesResponse.data.map(item => ({ ...item, type: 'Pending Training Bonus', status: 'pending' })),
          ...approvedResponse.data.map(item => ({ ...item, type: 'Approved Training Bonus', status: 'approved' })),
          ...rejectedResponse.data.map(item => ({ ...item, type: 'Rejected Training Bonus', status: 'rejected' })),
          ...referralResponse.data.map(item => ({
            ...item,
            type: 'Referral Payment Verification',
            status: item.status,
            amount: item.transactionAmount,
            accountNumber: '-', // Update this if you have account number field in your data
            gateway: item.gateway, // Include gateway if available
            remarks: 'Referral payment verification submitted',
          })),
          ...approvedReferralResponse.data.map(item => ({
            ...item,
            type: 'Approved Referral Payment',
            status: 'approved',
          })),
          ...rejectedReferralResponse.data.map(item => ({
            ...item,
            type: 'Rejected Referral Payment',
            status: 'rejected',
            remarks: item.feedback || 'No feedback provided', // Include feedback in remarks for rejected payments
          })),
        ];

        // Sort transactions by date in descending order
        combinedTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setTransactions(combinedTransactions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        setError('Error fetching transaction history. Please try again.');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [username]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'approved':
        return { backgroundColor: '#d4edda', color: '#155724' }; // Light green background
      case 'rejected':
        return { backgroundColor: '#f8d7da', color: '#721c24' }; // Light red background
      case 'pending':
        return { backgroundColor: '#fff3cd', color: '#856404' }; // Light yellow background
      default:
        return { backgroundColor: '#ffffff', color: '#000000' }; // Default white background
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom sx={{ color: 'secondary.main', textAlign: 'center' }}>
          Transaction History
        </Typography>
      </Grid>

      <Grid item xs={12} sm={8}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error" variant="h6">{error}</Typography>
        ) : transactions.length === 0 ? (
          <Typography variant="h6">No transactions found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>Gateway</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>Rs,{transaction.transactionAmount || transaction.amount}</TableCell>
                    <TableCell>
                      <Box sx={{
                        ...getStatusStyles(transaction.status),
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {transaction.status}
                      </Box>
                    </TableCell>
                    <TableCell>{transaction.accountNumber || '-'}</TableCell>
                    <TableCell>{transaction.gateway || '-'}</TableCell>
                    <TableCell>{transaction.remarks || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </Grid>
  );
};

export default TransactionHistory;
