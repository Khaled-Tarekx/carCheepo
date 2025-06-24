import { StatusCodes } from 'http-status-codes';
import * as MemberServices from './services.js';
import { checkUser } from '../../../utills/helpers.js';
import { UserNotFound } from '../../auth/errors/cause.js';
import { InvalidRole, MemberDeletionFailed, MemberNotFound, MemberUpdateNotPermitted, MemberUpdatingFailed, } from './errors/cause.js';
import { NotResourceOwner, NotValidId } from '../../../utills/errors/cause.js';
import { Forbidden, NotFound } from '../../../custom-errors/main.js';
import { WorkspaceNotFound } from '../errors/cause.js';
import * as ErrorMsg from './errors/msg.js';
import * as AuthErrorMsg from '../../auth/errors/msg.js';
import * as GlobalErrorMsg from '../../../utills/errors/msg.js';
import * as WorkspaceErrorMsg from '../errors/msg.js';
export const getMemberByUsername = async (req, res, next) => {
    const { username } = req.query;
    try {
        const member = await MemberServices.getMemberByUsername(username);
        res.status(StatusCodes.OK).json({ data: member });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(AuthErrorMsg.UserNotFound));
            case err instanceof MemberNotFound:
                return next(new NotFound(ErrorMsg.MemberNotFound));
            default:
                return next(err);
        }
    }
};
export const updateMemberPermissions = async (req, res, next) => {
    const { memberId, workspaceId } = req.params;
    try {
        const user = req.user;
        const { role } = req.body;
        checkUser(user);
        const updatedMember = await MemberServices.updateMemberPermissions({ memberId, workspaceId }, user, role);
        res.status(StatusCodes.OK).json({ data: updatedMember });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new NotFound(GlobalErrorMsg.NotValidId));
            case err instanceof InvalidRole:
                return next(new Forbidden(ErrorMsg.InvalidRole));
            case err instanceof WorkspaceNotFound:
                return next(new Forbidden(WorkspaceErrorMsg.WorkspaceNotFound));
            case err instanceof MemberNotFound:
                return next(new Forbidden(ErrorMsg.MemberNotFound));
            case err instanceof MemberUpdateNotPermitted:
                return next(new Forbidden(ErrorMsg.MemberUpdateNotPermitted));
            case err instanceof MemberUpdatingFailed:
                return next(new Forbidden(ErrorMsg.MemberUpdatingFailed));
            default:
                return next(err);
        }
    }
};
export const deleteMember = async (req, res, next) => {
    const { memberId, workspaceId } = req.params;
    const user = req.user;
    try {
        checkUser(user);
        const deletedMember = await MemberServices.deleteMember({ memberId, workspaceId }, user);
        res.status(StatusCodes.OK).json({ data: deletedMember });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new NotFound(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new NotFound(GlobalErrorMsg.NotValidId));
            case err instanceof WorkspaceNotFound:
                return next(new Forbidden(WorkspaceErrorMsg.WorkspaceNotFound));
            case err instanceof MemberNotFound:
                return next(new Forbidden(ErrorMsg.MemberNotFound));
            case err instanceof NotResourceOwner:
                return next(new Forbidden(GlobalErrorMsg.NotResourceOwner));
            case err instanceof MemberDeletionFailed:
                return next(new Forbidden(ErrorMsg.MemberDeletionFailed));
            default:
                return next(err);
        }
    }
};
