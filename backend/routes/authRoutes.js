import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  getUserCourses,
  registerUserCourseController,
  updateUserCourseProgressController,
  getMarketplaceProductsController,
  createMarketplaceProductController,
  updateMarketplaceProductStockController,
  deleteMarketplaceProductController,
  listUsers,
  updateUserRoleController,
} from '../controllers/authController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', register);           // RF-1.1
router.post('/login', login);                  // RF-1.2
router.post('/forgot-password', forgotPassword); // RF-1.3
router.post('/reset-password', resetPassword); // RF-1.3

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticateToken, getProfile);              // RF-1.4
router.put('/profile', authenticateToken, updateProfile);           // RF-1.4
router.put('/change-password', authenticateToken, changePassword);  // RF-1.4
router.get('/courses', authenticateToken, getUserCourses);
router.post('/courses/register', authenticateToken, registerUserCourseController);
router.put('/courses/progress', authenticateToken, updateUserCourseProgressController);
router.get('/marketplace', authenticateToken, getMarketplaceProductsController);
router.post('/marketplace', authenticateToken, createMarketplaceProductController);
router.put('/marketplace/:id/stock', authenticateToken, updateMarketplaceProductStockController);
router.delete('/marketplace/:id', authenticateToken, deleteMarketplaceProductController);

// Rutas administrativas (requieren autenticación y rol admin)
router.get('/users', authenticateToken, isAdmin, listUsers);                           // RF-1.5
router.put('/users/role', authenticateToken, isAdmin, updateUserRoleController);       // RF-1.5

export default router;
