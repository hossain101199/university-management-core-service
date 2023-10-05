import express from 'express';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';

const routes = express.Router();

const moduleRoutes = [
  {
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
];

moduleRoutes.forEach(route => routes.use(route.path, route.route));

export default routes;
