import axios from "axios";

const isProd = process.env.NODE_ENV === 'production';

let host = 'http://localhost:8000/api';
let authHost = 'http://localhost:8000/auth';

if (isProd) {
  host = '/api';
  authHost = '/auth';
}

const news = axios.create({
  baseURL: host,
  withCredentials: true,
  timeout: 3 * 1000 * 60,
  headers: {"Content-Type": "application/json"},
});

const auth = axios.create({
  baseURL: authHost,
  withCredentials: true,
  timeout: 3 * 1000 * 60,
  headers: {"Content-Type": "application/json"},
});

export default {
  news,
  auth,
};
