import express from 'express';
import { getMemberByUsername, deleteMember, updateMemberPermissions, } from './controllers.js';
import { validateResource } from '../../../utills/middlewares.js';
import { updateMemberSchema } from './validation.js';
const router = express.Router();
router.get('/search/members', getMemberByUsername);
router
    .route('/:workspaceId/members/:memberId')
    .patch(validateResource({
    bodySchema: updateMemberSchema,
}), updateMemberPermissions)
    .delete(deleteMember);
export default router;
