import express from 'express';
const app = express();
import api from './src/layers/api/index'

// initialize the routes
api(app);

export default app;
