import { WorkSpace, Member } from './models.js';
import { findResourceById, validateObjectIds, checkResource, isResourceOwner, } from '../../utills/helpers.js';
import { Role } from './members/types.js';
import { MemberNotFound } from './members/errors/cause.js';
import { WorkspaceCreationFailed, WorkspaceDeletionFailed, WorkspaceNotFound, WorkspaceUpdatingFailed, } from './errors/cause.js';
import Task from '../tasks/models.js';
export const getWorkSpaces = async () => {
    return WorkSpace.find({});
};
export const getMembersOfWorkSpace = async (workspaceId) => {
    validateObjectIds([workspaceId]);
    return Member.find({
        workspace: workspaceId,
    }).populate({ path: 'user', select: '-password' });
};
export const createWorkSpace = async (workSpaceData, user) => {
    const { name, type, description } = workSpaceData;
    const workSpaceOwner = new Member({
        role: Role.owner,
        user: user.id,
        description,
    });
    const workspace = await WorkSpace.create({
        name,
        type,
        owner: workSpaceOwner.id,
        description,
    });
    workSpaceOwner.workspace = workspace.id;
    await workSpaceOwner.save();
    checkResource(workSpaceOwner, MemberNotFound);
    checkResource(workspace, WorkspaceCreationFailed);
    return { workspace, workSpaceOwner };
};
export const getWorkSpace = async (workspaceId) => {
    validateObjectIds([workspaceId]);
    return findResourceById(WorkSpace, workspaceId, WorkspaceNotFound);
};
export const updateWorkSpace = async (workspaceId, workSpaceData, user) => {
    const { name, description, type } = workSpaceData;
    validateObjectIds([workspaceId]);
    const workspace = await findResourceById(WorkSpace, workspaceId, WorkspaceNotFound);
    const workspaceOwner = await findResourceById(Member, workspace.owner._id, MemberNotFound);
    await isResourceOwner(user.id, workspaceOwner.user._id);
    const updatedWorkSpace = await WorkSpace.findByIdAndUpdate(workspace.id, { name, description, type }, { new: true });
    checkResource(updatedWorkSpace, WorkspaceUpdatingFailed);
    return updatedWorkSpace;
};
export const deleteWorkSpace = async (workspaceId, user) => {
    validateObjectIds([workspaceId]);
    const workspace = await findResourceById(WorkSpace, workspaceId, WorkspaceNotFound);
    const workspaceOwner = await findResourceById(Member, workspace.owner._id, MemberNotFound);
    await isResourceOwner(user.id, workspaceOwner.user._id);
    await Task.deleteMany({ workspace: workspace._id });
    await Member.deleteMany({ workspace: workspace._id });
    const deletedWorkspace = await workspace.deleteOne();
    if (deletedWorkspace.deletedCount === 0) {
        throw new WorkspaceDeletionFailed();
    }
    return workspace;
};
