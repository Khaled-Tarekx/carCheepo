import Task from './models.js';
import { deleteSubtasksOfTask, getAssignees, notifyUserOfUpcomingDeadline, } from './utills.js';
import { checkResource, findResourceById, validateObjectIds, isResourceOwner, } from '../../utills/helpers.js';
import { Status, } from './types.js';
import { Member, WorkSpace } from '../workspaces/models.js';
import { TaskNotFound, TaskCreationFailed, TaskDeletionFailed, TaskUpdatingFailed, TaskMarkedCompleted, AssigneeNotFound, CompleteSubTasksFirst, } from './errors/cause.js';
import { MemberNotFound } from '../workspaces/members/errors/cause.js';
import { Comment } from '../comments/models.js';
export const getTasks = async () => {
    return Task.find({});
};
// return getOrSetCache('tasks', Task, (model) => model.find({}));
export const getTask = async (taskId) => {
    validateObjectIds([taskId]);
    return findResourceById(Task, taskId, TaskNotFound);
};
export const createTask = async (taskData, user, attachment) => {
    const { deadline, subtasks, priority, tags, status, assigneesId, workspaceId, parentTask, customFields, } = taskData;
    const verifiedAssignees = await getAssignees(assigneesId);
    const assignees = await Promise.all(verifiedAssignees.map(async (id) => {
        const member = await Member.findOne({
            _id: id,
            workspace: workspaceId,
        });
        checkResource(member, MemberNotFound);
        return member;
    }));
    checkResource(assignees, MemberNotFound);
    const creator = await Member.findOne({
        user: user.id,
        workspace: workspaceId,
    });
    checkResource(creator, MemberNotFound);
    const task = await Task.create({
        creator: creator._id,
        assignees: assignees,
        workspace: creator.workspace._id,
        attachment: attachment?.path,
        deadline,
        subtasks,
        parentTask,
        priority,
        tags,
        status,
        customFields,
    });
    checkResource(task, TaskCreationFailed);
    if (assignees) {
        task.status = Status.InProgress;
        await task.save();
        await notifyUserOfUpcomingDeadline(task);
    }
    return task;
};
export const updateTask = async (taskData, taskId, user, attachment) => {
    const { priority, tags, deadline, subtasks, assignees, customFields } = taskData;
    validateObjectIds([taskId]);
    const task = await findResourceById(Task, taskId, TaskNotFound);
    const creator = await findResourceById(Member, task.creator._id, MemberNotFound);
    await isResourceOwner(user.id, creator.user._id);
    const updatedTask = await Task.findByIdAndUpdate(task.id, {
        assignees: assignees,
        customFields: customFields,
        priority: priority,
        tags: tags,
        deadline: deadline,
        subtasks: subtasks,
        attachment: attachment?.path,
    }, { new: true });
    checkResource(updatedTask, TaskUpdatingFailed);
    await notifyUserOfUpcomingDeadline(task);
    return task;
};
export const deleteTask = async (user, taskId) => {
    validateObjectIds([taskId]);
    const task = await findResourceById(Task, taskId, TaskNotFound);
    const creator = await findResourceById(Member, task.creator._id, MemberNotFound);
    await isResourceOwner(user.id, creator.user._id);
    await deleteSubtasksOfTask(task._id);
    await WorkSpace.findByIdAndUpdate(task.workspace._id, {
        $pull: { tasks: task._id },
    });
    await Comment.deleteMany({ task: task._id });
    const deletedTask = await task.deleteOne();
    if (deletedTask.deletedCount === 0) {
        throw new TaskDeletionFailed();
    }
    return task;
};
export const assignTask = async (taskId, assigneesInput, user) => {
    const { assigneesId } = assigneesInput;
    validateObjectIds([taskId, ...assigneesId]);
    const task = await findResourceById(Task, taskId, TaskNotFound);
    const creator = await findResourceById(Member, task.creator._id, MemberNotFound);
    await isResourceOwner(user.id, creator.user._id);
    const assignees = await Promise.all(assigneesId.map(async (id) => {
        const member = await Member.findOne({
            _id: id,
            workspace: task.workspace._id,
        });
        checkResource(member, MemberNotFound);
        return member;
    }));
    const assignedTask = await Task.findByIdAndUpdate(task.id, { assignees: assignees, status: 'inProgress' }, { new: true }).populate({
        path: 'assignee',
        populate: {
            path: 'user',
            select: 'email position',
        },
    });
    checkResource(assignedTask, TaskUpdatingFailed);
    await notifyUserOfUpcomingDeadline(assignedTask);
    return assignedTask;
};
export const markCompleted = async (taskId, user) => {
    validateObjectIds([taskId]);
    const task = await findResourceById(Task, taskId, TaskNotFound);
    if (task.status === Status.Completed) {
        throw new TaskMarkedCompleted();
    }
    const creator = await findResourceById(Member, task.creator._id, MemberNotFound);
    await isResourceOwner(user.id, creator.user._id);
    if (!task.assignees) {
        throw new AssigneeNotFound();
    }
    if (task.subtasks && task.subtasks.length > 0) {
        const incompleteSubTasks = await Task.find({
            _id: { $in: task.subtasks },
            status: { $ne: 'completed' },
        });
        incompleteSubTasks.map((sub) => sub._id).join(', ');
        if (incompleteSubTasks.length > 0) {
            throw new CompleteSubTasksFirst();
        }
    }
    const taskToMark = await Task.findByIdAndUpdate(task._id, { status: Status.Completed }, { new: true });
    checkResource(taskToMark, TaskUpdatingFailed);
    await Task.updateMany({ subtasks: task._id }, { $pull: { subtasks: task.id } });
    return taskToMark;
};
