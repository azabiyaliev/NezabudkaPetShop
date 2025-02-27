import {UserFields} from "../types";
import mongoose, {HydratedDocument, Model} from "mongoose";
import {randomUUID} from "crypto";
import bcrypt from "bcrypt";

interface UserMethods {
    generateToken(): void;
    checkPassword(password: string): Promise<boolean>;
}

type UserModel = Model<UserFields, {}, UserMethods>

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

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
                    if (!this.isNew) return true;
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
    password: {
        type: String,
        required: true,
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
        validate: [
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

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isModified("phone")) {
        this.phone = this.phone.replace(/[^\d+]/g, "");

        if (!this.phone.startsWith("+996")) {
            this.phone = this.phone.replace(/^0/, "");
            this.phone = "+996" + this.phone;
        }
    }

    next();
});

UserSchema.methods.checkPassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    this.token = randomUUID();
};

UserSchema.set('toJSON', {
    transform: (_doc, ret, _options) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('User', UserSchema);
export default User;