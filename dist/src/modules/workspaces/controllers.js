import { StatusCodes } from 'http-status-codes';
import * as WorkSpaceServices from './services.js';
import { checkUser } from '../../utills/helpers.js';
import { NotResourceOwner, NotValidId } from '../../utills/errors/cause.js';
import { BadRequestError, AuthenticationError, NotFound, Conflict, } from '../../custom-errors/main.js';
import { UserNotFound } from '../auth/errors/cause.js';
import { MemberNotFound } from './members/errors/cause.js';
import { WorkspaceCreationFailed, WorkspaceDeletionFailed, WorkspaceNotFound, WorkspaceUpdatingFailed, } from './errors/cause.js';
import * as MemberErrorMsg from './members/errors/msg.js';
import * as GlobalErrorMsg from '../../utills/errors/msg.js';
import * as ErrorMsg from './errors/msg.js';
export const getWorkSpaces = async (_req, res) => {
    const workSpaces = await WorkSpaceServices.getWorkSpaces();
    res
        .status(StatusCodes.OK)
        .json({ data: workSpaces, count: workSpaces.length });
};
export const getMembersOfWorkSpace = async (req, res, next) => {
    const { workspaceId } = req.params;
    try {
        const members = await WorkSpaceServices.getMembersOfWorkSpace(workspaceId);
        res.status(StatusCodes.OK).json({ data: members, count: members.length });
    }
    catch (err) {
        switch (true) {
            case err instanceof NotValidId:
                return next(new BadRequestError(GlobalErrorMsg.NotValidId));
            default:
                return next(err);
        }
    }
};
export const createWorkSpace = async (req, res, next) => {
    const { name, type, description } = req.body;
    try {
        const user = req.user;
        checkUser(user);
        const data = await WorkSpaceServices.createWorkSpace({ name, type, description }, user);
        res.status(StatusCodes.OK).json({
            data,
        });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof MemberNotFound:
                return next(new NotFound(MemberErrorMsg.MemberNotFound));
            case err instanceof WorkspaceCreationFailed:
                return next(new Conflict(ErrorMsg.WorkspaceCreationFailed));
            default:
                return next(err);
        }
    }
};
export const getWorkSpace = async (req, res, next) => {
    const { workspaceId } = req.params;
    try {
        const work_space = await WorkSpaceServices.getWorkSpace(workspaceId);
        res.status(StatusCodes.OK).json({ data: work_space });
    }
    catch (err) {
        switch (true) {
            case err instanceof NotValidId:
                return next(new AuthenticationError(GlobalErrorMsg.NotValidId));
            default:
                return next(err);
        }
    }
};
export const updateWorkSpace = async (req, res, next) => {
    const { workspaceId } = req.params;
    const { name, description, type } = req.body;
    const user = req.user;
    try {
        checkUser(user);
        const updatedWorkSpace = await WorkSpaceServices.updateWorkSpace(workspaceId, { name, description, type }, user);
        res.status(StatusCodes.OK).json({
            data: updatedWorkSpace,
        });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new AuthenticationError(GlobalErrorMsg.NotValidId));
            case err instanceof WorkspaceNotFound:
                return next(new NotFound(ErrorMsg.WorkspaceNotFound));
            case err instanceof MemberNotFound:
                return next(new NotFound(MemberErrorMsg.MemberNotFound));
            case err instanceof NotResourceOwner:
                return next(new NotFound(GlobalErrorMsg.NotResourceOwner));
            case err instanceof WorkspaceUpdatingFailed:
                return next(new Conflict(ErrorMsg.WorkspaceUpdatingFailed));
            default:
                next(err);
        }
    }
};
export const deleteWorkSpace = async (req, res, next) => {
    const user = req.user;
    const { workspaceId } = req.params;
    try {
        checkUser(user);
        const deletedWorkspace = await WorkSpaceServices.deleteWorkSpace(workspaceId, user);
        res.status(StatusCodes.OK).json({ data: deletedWorkspace });
    }
    catch (err) {
        switch (true) {
            case err instanceof UserNotFound:
                return next(new AuthenticationError(GlobalErrorMsg.LoginFirst));
            case err instanceof NotValidId:
                return next(new AuthenticationError(GlobalErrorMsg.NotValidId));
            case err instanceof WorkspaceNotFound:
                return next(new NotFound(ErrorMsg.WorkspaceNotFound));
            case err instanceof MemberNotFound:
                return next(new NotFound(MemberErrorMsg.MemberNotFound));
            case err instanceof NotResourceOwner:
                return next(new NotFound(GlobalErrorMsg.NotResourceOwner));
            case err instanceof WorkspaceDeletionFailed:
                return next(new Conflict(ErrorMsg.WorkspaceDeletionFailed));
            default:
                return next(err);
        }
    }
};
