import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterController } from './academicSemester.controller';
import { academicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(academicSemesterValidation.createAcademicSemesterZodSchema),
  academicSemesterController.createSemester,
);

router.get('/:id', academicSemesterController.getSingleSemester);

router.patch('/:id');

router.delete('/:id');

router.get('/', academicSemesterController.getAllSemesters);

export const academicSemesterRoutes = router;
