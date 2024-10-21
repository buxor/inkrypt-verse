import axios from 'axios';

const API_BASE_URL = 'https://open-api.unisat.io/v2';
const API_KEY = '1e99b7f91b8f082ece273c187a1784519f90c3ad554cc4c4b9c4bbd1b30d7485';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const createInscriptionOrder = async (content: string, contentType: string, receiveAddress: string) => {
  try {
    const response = await axiosInstance.post('/inscribe/order/create', {
      receiveAddress,
      feeRate: 1, // You may want to make this configurable
      outputValue: 546, // Minimum sat value for an inscription
      files: [{
        filename: 'content.txt',
        dataURL: `data:${contentType};base64,${btoa(content)}`,
      }],
      devAddress: '', // Optional: Add your developer address if you want to receive fees
      devFee: 0, // Optional: Set a developer fee
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating inscription order:', error);
    throw error;
  }
};

export const getOrderStatus = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(`/inscribe/order/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error getting order status:', error);
    throw error;
  }
};

export const getPaymentDetails = async (orderId: string) => {
  try {
    const orderDetails = await getOrderStatus(orderId);
    return {
      amount: orderDetails.amount,
      address: orderDetails.payAddress,
    };
  } catch (error) {
    console.error('Error getting payment details:', error);
    throw error;
  }
};

export const makePaymentWithWallet = async (orderId: string) => {
  try {
    const paymentDetails = await getPaymentDetails(orderId);
    
    // Here we would typically interact with the wallet API to make the payment
    // Since we don't have direct access to the UniSat wallet API, we'll simulate the payment
    // In a real implementation, you would use the appropriate wallet API calls
    
    console.log(`Simulating payment of ${paymentDetails.amount} sats to ${paymentDetails.address}`);
    
    // Simulate a delay to represent the payment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would check the transaction status and return appropriate information
    return { success: true, txid: 'simulated_transaction_id' };
  } catch (error) {
    console.error('Error making payment with wallet:', error);
    throw error;
  }
};

export const refundOrder = async (orderId: string) => {
  try {
    const response = await axiosInstance.post('/inscribe/refund', { orderId });
    return response.data;
  } catch (error) {
    console.error('Error refunding order:', error);
    throw error;
  }
};