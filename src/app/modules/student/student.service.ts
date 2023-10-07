import { Prisma, Student } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { studentSearchableFields } from './student.constant';
import { IStudentFilters } from './student.interface';

const createStudentInDB = async (payload: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data: payload,
    include: {
      academicSemester: true,
      academicDepartment: true,
      academicFaculty: true,
    },
  });

  return result;
};

const getSingleStudentFromDB = async (
  payload: string,
): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      id: payload,
    },
  });
  return result;
};

const getAllStudentFromDB = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<Student[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const sortConditions: { [key: string]: string } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.student.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.student.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const studentService = {
  createStudentInDB,
  getSingleStudentFromDB,
  getAllStudentFromDB,
};
