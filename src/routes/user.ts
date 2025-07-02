import express from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/user';
import authenticate from '../middlewares/authenticate';
import { isAdmin } from '../middlewares/role';

const user = express.Router();

user.use(authenticate);

user.route('/').get(getAllUsers).post(isAdmin, createUser);
user
  .route('/:id')
  .get(getUserById)
  .patch(isAdmin, updateUser)
  .delete(isAdmin, deleteUser);

export default user;
