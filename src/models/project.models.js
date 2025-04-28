import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: false,
    },

    createdBy: {
        type: String,
        required: true,
        trim: true,
    },
});

export const Project = mongoose.model("Project", projectSchema);
