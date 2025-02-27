import express from "express";
import {Error} from "mongoose";
import User from "../models/User";

const UsersRouter = express.Router();

UsersRouter.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({error: 'An error occurred'});
    }
});

UsersRouter.post('/register', async (req, res) => {
    try {
        const {firstName, lastName, email, phone, role} = req.body;

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            role: role,
        });

        user.generateToken();

        await user.save();

        res.status(200).send({user, message: 'Successfully registered'});
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
    }
});

export default UsersRouter;