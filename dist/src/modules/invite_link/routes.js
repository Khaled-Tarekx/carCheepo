import express from 'express';
import { acceptInvitation, createInviteLink } from './controllers.js';
import { validateResource } from '../../utills/middlewares.js';
import { acceptInvitationSchema, createInviteSchema } from './validation.js';
const router = express.Router();
router.post('/invite', validateResource({ bodySchema: createInviteSchema }), createInviteLink);
router.post('/accept-invitation', validateResource({ bodySchema: acceptInvitationSchema }), acceptInvitation);
export default router;
