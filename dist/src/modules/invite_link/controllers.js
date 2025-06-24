import { StatusCodes } from 'http-status-codes';
import { checkUser } from '../../utills/helpers.js';
import * as InviteServices from './services.js';
import { InviteFailed, inviteLinkNotFound, WorkspaceNotFound, WorkspaceOwnerNotFound, } from './errors/cause.js';
import * as ErrorMsg from './errors/msg.js';
import { MemberCreationFailed } from '../workspaces/members/errors/cause.js';
import { UserNotFound } from '../auth/errors/cause.js';
import { AuthenticationError, Forbidden, NotFound, Conflict, ResourceGone, } from '../../custom-errors/main.js';
import { LinkExpired, NotResourceOwner } from '../../utills/errors/cause.js';
import * as GlobalErrorMsg from '../../utills/errors/msg.js';
import * as WorkspaceErrors from '../workspaces/errors/msg.js';
export const createInviteLink = async (req, res, next) => {
    const { workspaceId, receiverId } = req.body;
    try {
        const user = req.user;
        checkUser(user);
        const invitation = await InviteServices.createInviteLink({ workspaceId, receiverId }, user);
        res.status(StatusCodes.CREATED).json({ invitation });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof WorkspaceNotFound:
                return next(new NotFound(WorkspaceErrors.WorkspaceNotFound));
            case err instanceof WorkspaceOwnerNotFound:
                return next(new NotFound(ErrorMsg.OwnerNotAssigned));
            case err instanceof NotResourceOwner:
                return next(new Forbidden(ErrorMsg.NotOwnerOrAdmin));
            case err instanceof InviteFailed:
                return next(new Conflict(ErrorMsg.InvitationFailed));
            default:
                return next(err);
        }
    }
};
export const acceptInvitation = async (req, res, next) => {
    const { token } = req.body;
    try {
        const member = await InviteServices.acceptInvitation(token);
        res.status(StatusCodes.CREATED).json({ member });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof inviteLinkNotFound:
                return next(new NotFound(ErrorMsg.InviteLinkNotFound));
            case err instanceof LinkExpired:
                return next(new ResourceGone(ErrorMsg.InvitationExpired));
            case err instanceof MemberCreationFailed:
                return next(new Conflict(ErrorMsg.MempershipFailed));
            default:
                return next(err);
        }
    }
};
