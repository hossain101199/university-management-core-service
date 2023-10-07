import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { facultyController } from './faculty.controller';
import { facultyValidation } from './faculty.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(facultyValidation.createFacultyZodSchema),
  facultyController.createFaculty,
);

router.get('/:id', facultyController.getSingleFaculty);

router.patch('/:id');

router.delete('/:id');

router.get('/', facultyController.getAllFaculty);

export const facultyRoutes = router;
