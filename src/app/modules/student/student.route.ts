import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { studentController } from './student.controller';
import { studentValidation } from './student.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(studentValidation.createStudentZodSchema),
  studentController.createStudent,
);

router.get('/:id', studentController.getSingleStudent);

router.patch('/:id');

router.delete('/:id');

router.get('/', studentController.getAllStudent);

export const studentRoutes = router;
