import mongoose, { Schema } from "mongoose";

import { AvailableUserRoles, UserRolesEnum } from "../utils/constant";

const projectNoteSchema = new Schema(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        role: {
            type: String,
            enum: AvailableUserRoles,
            default: UserRolesEnum.MEMBER,
        },

        content: {
            type: String,
        },
    },
    { timestamps: true },
);

export const ProjectNote = mongoose.model("ProjectNote", projectNoteSchema);
