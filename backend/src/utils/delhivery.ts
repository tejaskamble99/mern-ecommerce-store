import axios from 'axios';

export const delhiveryAPI = axios.create({
  baseURL: process.env.DELHIVERY_BASE_URL,
  headers: {
    'Authorization': `Token ${process.env.DELHIVERY_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});