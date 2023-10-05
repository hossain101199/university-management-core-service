import { AcademicFaculty } from '@prisma/client';
import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicFacultyFilterableFields } from './academicFaculty.constant';
import { academicFacultyService } from './academicFaculty.service';

const createAcademicFaculty: RequestHandler = catchAsync(async (req, res) => {
  const academicFacultyTitle = req.body;

  const result =
    await academicFacultyService.createAcademicFacultyInDB(
      academicFacultyTitle,
    );

  sendResponse<AcademicFaculty>(res, {
    statusCode: 200,
    success: true,
    message: 'Academic faculty is created successfully',
    data: result,
  });
});

const getSingleAcademicFaculty: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    const result =
      await academicFacultyService.getSingleAcademicFacultyFromDB(id);

    if (result === null) {
      sendResponse<AcademicFaculty>(res, {
        statusCode: 404,
        success: false,
        message: `Error: Academic faculty with ID ${id} is not found. Please verify the provided ID and try again`,
        data: result,
      });
    } else {
      sendResponse<AcademicFaculty>(res, {
        statusCode: 200,
        success: true,
        message: 'Academic faculty retrieved successfully',
        data: result,
      });
    }
  },
);

const getAllAcademicFaculties: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, academicFacultyFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await academicFacultyService.getAllAcademicFacultiesFromDB(
    filters,
    paginationOptions,
  );

  sendResponse<AcademicFaculty[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Academic faculty retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const academicFacultyController = {
  createAcademicFaculty,
  getSingleAcademicFaculty,
  getAllAcademicFaculties,
};
