import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicDepartmentController } from './academicDepartment.controller';
import { academicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(
    academicDepartmentValidation.createAcademicDepartmentZodSchema,
  ),
  academicDepartmentController.createAcademicDepartment,
);

router.get('/:id', academicDepartmentController.getSingleAcademicFaculty);

router.patch('/:id');

router.delete('/:id');

router.get('/', academicDepartmentController.getAllAcademicDepartments);

export const academicDepartmentRoutes = router;
