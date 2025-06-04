import express from 'express';
import { createUser, getUsersByQuery,  getUserById, updateUser, deleteUser } from '../controllers/userController';

const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsersByQuery);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
