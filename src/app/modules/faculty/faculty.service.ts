import { Faculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { facultySearchableFields } from './faculty.constant';
import { IFacultyFilters } from './faculty.interface';

const createFacultyInDB = async (payload: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data: payload,
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
  });

  return result;
};

const getSingleFacultyFromDB = async (
  payload: string,
): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: {
      id: payload,
    },
  });
  return result;
};

const getAllFacultyFromDB = async (
  filters: IFacultyFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<Faculty[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableFields.map(field => ({
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

  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const sortConditions: { [key: string]: string } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.faculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.faculty.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const facultyService = {
  createFacultyInDB,
  getSingleFacultyFromDB,
  getAllFacultyFromDB,
};
