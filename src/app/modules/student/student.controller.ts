import { Student } from '@prisma/client';
import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentFilterableFields } from './student.constant';
import { studentService } from './student.service';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const student = req.body;

  const result = await studentService.createStudentInDB(student);

  sendResponse<Student>(res, {
    statusCode: 200,
    success: true,
    message: 'student is created successfully',
    data: result,
  });
});

const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await studentService.getSingleStudentFromDB(id);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: Student with ID ${id} is not found. Please verify the provided ID and try again`,
    );
  } else {
    sendResponse<Student>(res, {
      statusCode: 200,
      success: true,
      message: 'Student retrieved successfully',
      data: result,
    });
  }
});

const getAllStudent: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, studentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await studentService.getAllStudentFromDB(
    filters,
    paginationOptions,
  );

  sendResponse<Student[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Students retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const studentController = {
  createStudent,
  getSingleStudent,
  getAllStudent,
};
