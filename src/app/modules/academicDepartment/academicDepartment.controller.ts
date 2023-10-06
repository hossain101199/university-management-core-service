import { AcademicDepartment } from '@prisma/client';
import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicDepartmentFilterableFields } from './academicDepartment.constant';
import { academicDepartmentService } from './academicDepartment.service';

const createAcademicDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const academicDepartmentData = req.body;

    const result = await academicDepartmentService.createAcademicDepartmentInDB(
      academicDepartmentData,
    );

    sendResponse<AcademicDepartment>(res, {
      statusCode: 200,
      success: true,
      message: 'Academic department is created successfully',
      data: result,
    });
  },
);

const getSingleAcademicFaculty: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    const result =
      await academicDepartmentService.getSingleAcademicDepartmentFromDB(id);

    if (result === null) {
      sendResponse<AcademicDepartment>(res, {
        statusCode: 404,
        success: false,
        message: `Error: Academic Department with ID ${id} is not found. Please verify the provided ID and try again`,
        data: result,
      });
    } else {
      sendResponse<AcademicDepartment>(res, {
        statusCode: 200,
        success: true,
        message: 'Academic Department retrieved successfully',
        data: result,
      });
    }
  },
);

const getAllAcademicDepartments: RequestHandler = catchAsync(
  async (req, res) => {
    const filters = pick(req.query, academicDepartmentFilterableFields);

    const paginationOptions = pick(req.query, paginationFields);

    const result =
      await academicDepartmentService.getAllAcademicDepartmentsFromDB(
        filters,
        paginationOptions,
      );

    sendResponse<AcademicDepartment[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Academic department retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

export const academicDepartmentController = {
  createAcademicDepartment,
  getSingleAcademicFaculty,
  getAllAcademicDepartments,
};
