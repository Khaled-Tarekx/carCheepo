import User from '../users/models.js';
import moment from 'moment';
import Task from './models.js';
import emailQueue from './queue.js';
import { findResourceById } from '../../utills/helpers.js';
import { Member } from '../workspaces/models.js';
import { MemberNotFound } from '../workspaces/members/errors/cause.js';
import { UserNotFound } from '../auth/errors/cause.js';
import { MailFailedToSend } from './errors/cause.js';
export const notifyUserOfUpcomingDeadline = async (task) => {
    const currentTime = moment(new Date());
    const deadLine = moment(new Date(task.deadline));
    const daysUntilDeadline = deadLine.diff(currentTime, 'days');
    if (daysUntilDeadline === 0) {
        const hoursUntilDeadLine = deadLine.diff(currentTime, 'hours');
        if (hoursUntilDeadLine <= 12 && hoursUntilDeadLine > 0) {
            return await sendNotification(`reminder: task deadLine is in ${hoursUntilDeadLine} hours`, task);
        }
    }
    else if (daysUntilDeadline === 1) {
        return await sendNotification(`reminder: task deadLine is in ${daysUntilDeadline} day`, task);
    }
    else if (daysUntilDeadline === 3) {
        return await sendNotification(`reminder: task deadLine is in ${daysUntilDeadline} days`, task);
    }
};
const sendEmails = async (users, subject, message) => {
    const currentDate = moment(new Date()).format('DD MM YYYY hh:mm:ss');
    const emailPromises = users.map((user) => emailQueue.add({
        to: user.email,
        subject: subject,
        text: message,
        date: currentDate,
    }));
    await Promise.all(emailPromises);
};
export const sendNotification = async (message, task) => {
    try {
        const assignees = await Promise.all(task.assignees.map(async (assignee) => {
            const member = findResourceById(Member, assignee._id, MemberNotFound);
            return member;
        }));
        const users = await Promise.all(assignees.map(async (assignee) => {
            const user = findResourceById(User, assignee.user._id, UserNotFound);
            return user;
        }));
        const subject = 'reminder: task_deadline';
        sendEmails(users, subject, message);
    }
    catch (err) {
        return new MailFailedToSend();
    }
};
emailQueue.on('completed', (job) => {
    console.log(`Email job with id ${job.id} has been completed`);
});
emailQueue.on('failed', (job, err) => {
    console.log(`Email job with id ${job.id} has failed with error ${err.message}`);
});
export const getAssignees = async (assigneesId) => {
    if (!Array.isArray(assigneesId) || assigneesId.length === 0) {
        return [];
    }
    return assigneesId;
};
export const deleteSubtasksOfTask = async (parentTaskId) => {
    const subtasks = await Task.find({ parentTask: parentTaskId });
    for (const subtask of subtasks) {
        await deleteSubtasksOfTask(subtask._id);
        await subtask.deleteOne();
    }
};
