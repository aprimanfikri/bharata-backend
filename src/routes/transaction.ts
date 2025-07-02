import express from 'express';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
} from '../controllers/transaction';
import authenticate from '../middlewares/authenticate';

const transaction = express.Router();

transaction.use(authenticate);

transaction.route('/').get(getAllTransactions).post(createTransaction);
transaction.route('/:id').get(getTransactionById);

export default transaction;
