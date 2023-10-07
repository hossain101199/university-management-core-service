import { Faculty } from '@prisma/client';
import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilterableFields } from './faculty.constant';
import { facultyService } from './faculty.service';

const createFaculty: RequestHandler = catchAsync(async (req, res) => {
  const faculty = req.body;

  const result = await facultyService.createFacultyInDB(faculty);

  sendResponse<Faculty>(res, {
    statusCode: 200,
    success: true,
    message: 'faculty is created successfully',
    data: result,
  });
});

const getSingleFaculty: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await facultyService.getSingleFacultyFromDB(id);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: Faculty with ID ${id} is not found. Please verify the provided ID and try again`,
    );
  } else {
    sendResponse<Faculty>(res, {
      statusCode: 200,
      success: true,
      message: 'Faculty retrieved successfully',
      data: result,
    });
  }
});

const getAllFaculty: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, facultyFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await facultyService.getAllFacultyFromDB(
    filters,
    paginationOptions,
  );

  sendResponse<Faculty[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Faculties retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const facultyController = {
  createFaculty,
  getSingleFaculty,
  getAllFaculty,
};
