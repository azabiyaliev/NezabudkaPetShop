import {UserFields} from "../types";
import mongoose, {HydratedDocument, Model} from "mongoose";

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>

const Schema = mongoose.Schema;

const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;
const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;


const UserSchema = new Schema<
    HydratedDocument<UserFields>,
    UserModel,
    UserMethods>({

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            {
                validator: async function (this: HydratedDocument<UserFields>, value: string): Promise<boolean> {
                    const user: UserFields | null = await User.findOne({ email: value });
                    return !user;
                },
                message: "This Email already exists",
            },
            {
                validator:  async function (this: HydratedDocument<UserFields>, value: string): Promise<boolean> {
                    return regEmail.test(value);
                },
                message: "Invalid email format",
            },
        ]
    },
    role: {
        type: String,
        required: true,
        default: 'client',
        enum: ["admin", "client"],
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: [
            {
                validator: async function (this: HydratedDocument<UserFields>, value: string): Promise<boolean> {
                    const user: UserFields | null = await User.findOne({ phone: value });
                    return !user;
                },
                message: "This phone already exists",
            },
            {
                validator:  async function (this: HydratedDocument<UserFields>, value: string): Promise<boolean> {
                    return regPhone.test(value);
                },
                message: "Invalid phone format",
            },
        ]
    },
    token: {
        type: String,
        required: true,
    }
});

UserSchema.pre("save", function (next) {
    if (!this.isModified("phone")) return next();

    this.phone = this.phone.replace(/[\s\-()]/g, "");

    if (!this.phone.startsWith("+")) {
        this.phone = "+996" + this.phone.replace(/^0/, "");
    }
    next();
});


const User = mongoose.model('User', UserSchema);
export default User;