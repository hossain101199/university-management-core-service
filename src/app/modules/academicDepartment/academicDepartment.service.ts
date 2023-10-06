import { AcademicDepartment, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { academicDepartmentSearchableFields } from './academicDepartment.constant';
import { IAcademicDepartmentFilters } from './academicDepartment.interface';

const createAcademicDepartmentInDB = async (
  payload: AcademicDepartment,
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.create({
    data: payload,
    include: {
      academicFaculty: true,
    },
  });

  return result;
};

const getSingleAcademicDepartmentFromDB = async (
  payload: string,
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: {
      id: payload,
    },
  });
  return result;
};

const getAllAcademicDepartmentsFromDB = async (
  filters: IAcademicDepartmentFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<AcademicDepartment[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: academicDepartmentSearchableFields.map(field => ({
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

  const whereConditions: Prisma.AcademicDepartmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const sortConditions: { [key: string]: string } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.academicDepartment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.academicDepartment.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const academicDepartmentService = {
  createAcademicDepartmentInDB,
  getSingleAcademicDepartmentFromDB,
  getAllAcademicDepartmentsFromDB,
};
