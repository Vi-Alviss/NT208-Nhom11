import express from 'express';
import { getProjects, createProject, updateProject, deleteProject, getProjectById } from '../controllers/projectController.js';

const projectRoutes = express.Router();
projectRoutes.get('/getproject', getProjects);
projectRoutes.post('/createproject', createProject);
projectRoutes.put('/updateproject/:ProjectID', updateProject);
projectRoutes.delete('/deleteproject/:ProjectID', deleteProject);
projectRoutes.get('/getprojectbyid/:ProjectID', getProjectById);