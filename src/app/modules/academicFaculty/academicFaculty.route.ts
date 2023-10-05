import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyController } from './academicFaculty.controller';
import { academicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(academicFacultyValidation.createAcademicFacultyZodSchema),
  academicFacultyController.createAcademicFaculty,
);

router.get('/:id', academicFacultyController.getSingleAcademicFaculty);

router.patch('/:id');

router.delete('/:id');

router.get('/', academicFacultyController.getAllAcademicFaculties);

export const academicFacultyRoutes = router;
