/** @format */
import { UnAuthorized, UserNotFound } from "./errors/cause.js";
import { checkResource } from "../../utills/helpers.js";
import { getUserFromToken } from "./utillities.js";
const access_secret = process.env.ACCESS_SECRET_KEY;
export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new UnAuthorized());
    }
    const token = authHeader.split(" ")[1];
    const user = await getUserFromToken(token, access_secret);
    checkResource(user, UserNotFound);
    req.user = {
        ...user.toObject(),
        id: user._id.toString(),
    };
    next();
};
