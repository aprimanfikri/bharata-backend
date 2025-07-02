import express from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/product';
import authenticate from '../middlewares/authenticate';

const user = express.Router();

user.route('/').get(getAllProducts).post(authenticate, createProduct);
user
  .route('/:id')
  .get(getProductById)
  .patch(authenticate, updateProduct)
  .delete(authenticate, deleteProduct);

export default user;
