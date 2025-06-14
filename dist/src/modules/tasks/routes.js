import { Router } from 'express';
import { getTask, getTasks, createTask, updateTask, deleteTask, assignTask, markCompleted, } from './controllers.js';
import uploads from '../../setup/upload.js';
import { validateResource } from '../../utills/middlewares.js';
import { createTaskSchema, updateTaskSchema } from './validation.js';
const router = Router();
router
    .route('/')
    .get(getTasks)
    .post(validateResource({ bodySchema: createTaskSchema }), uploads.single('attachment'), createTask);
router.patch('/:taskId/assign/:assigneeId', assignTask);
router.patch('/:taskId/completed', markCompleted);
router
    .route('/:taskId')
    .get(getTask)
    .patch(validateResource({ bodySchema: updateTaskSchema }), uploads.single('attachment'), updateTask)
    .delete(deleteTask);
export default router;
