import express from "express";
import {Error} from "mongoose";
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";

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
        const {firstName, lastName, email, phone, role, password} = req.body;

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
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

UsersRouter.post('/sessions', async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        });

        if (!user) {
            res.status(400).send({error: 'Email Not Found'});
            return;
        }

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) {
            res.status(400).send({error: 'Password is incorrect'});
            return;
        }

        user.generateToken();
        await user.save();

        res.send({message: 'Email and password are correct!', user});

    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
    }
});

UsersRouter.delete('/sessions', auth, async (req, res) => {
    let reqWithAuth = req as RequestWithUser;
    const userFromAuth = reqWithAuth.user;

    try {
        const user = await User.findOne({
            _id: userFromAuth._id,
        });

        if (user) {
            user.generateToken();
            await user.save();

            res.send({message: 'Success logout'});
        }
    } catch (e) {
        res.status(400).send({error: 'An error occurred'});
    }

});

export default UsersRouter;