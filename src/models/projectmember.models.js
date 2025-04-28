import mongoose, { Schema } from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constant";

const projectMemberSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
    },

    role: {
        type: String,
        enum: AvailableUserRoles,
        default: UserRolesEnum.MEMBER,
    },
});

export const ProjectMember = mongoose.model(
    "ProjectMember",
    projectMemberSchema,
);
