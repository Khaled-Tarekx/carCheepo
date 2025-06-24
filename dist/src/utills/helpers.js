import z from 'zod';
import { client } from '../../main.js';
import { Types } from 'mongoose';
import { LinkExpired, NotResourceOwner, NotValidId, WorkspaceMismatch, } from './errors/cause.js';
import { UserNotFound } from '../modules/auth/errors/cause.js';
const DEFAULT_EXPIRATION = process.env.DEFAULT_EXPIRATION_CASHE;
export const getOrSetCache = async (key, model, queryMethod) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await client.get(key);
            if (data != null) {
                return resolve(JSON.parse(data));
            }
            const freshData = await queryMethod(model);
            await client.setEx(key, Number(DEFAULT_EXPIRATION), JSON.stringify(freshData));
            resolve(freshData);
        }
        catch (err) {
            reject(err);
        }
    });
};
export const mongooseId = z.custom((v) => Types.ObjectId.isValid(v), {
    message: 'id is not valid mongoose id ',
});
export const findResourceById = async (model, id, serviceError) => {
    const resource = await model.findById(id);
    if (!resource) {
        throw new serviceError();
    }
    return resource;
};
export function checkUser(user) {
    if (!user) {
        throw new UserNotFound();
    }
}
export function checkResource(resource, serviceError) {
    if (!resource) {
        throw new serviceError();
    }
}
export const validateObjectIds = (ids) => {
    const isValidIds = ids.every((id) => Types.ObjectId.isValid(id));
    if (!isValidIds) {
        throw new NotValidId();
    }
};
export const isResourceOwner = async (loggedInUserId, requesterId) => {
    const userIsResourceOwner = loggedInUserId === requesterId.toString();
    if (!userIsResourceOwner) {
        throw new NotResourceOwner();
    }
    return true;
};
export const compareMembersWorkspace = async (assigneeWorkspace, creatorWorkspacee) => {
    const isSameWorkspace = assigneeWorkspace === creatorWorkspacee;
    if (!isSameWorkspace) {
        throw new WorkspaceMismatch();
    }
    return true;
};
export const isExpired = (expiresAt, createdAt) => {
    if (expiresAt.getTime() <= createdAt.getTime()) {
        throw new LinkExpired();
    }
    return true;
};
