import mongoose from "mongoose";

const collectionName = "Usuarios";
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
    },
    age: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "usuario",
    },
});
const userModel = mongoose.model(collectionName, userSchema);
export default userModel;