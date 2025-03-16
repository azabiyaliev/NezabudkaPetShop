import express from "express";
import {Error} from "mongoose";
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";
import config from "../config";
import {OAuth2Client} from "google-auth-library";
import * as crypto from 'crypto';

const usersRouter = express.Router()
const client = new OAuth2Client(config.google.clientId);


usersRouter.post("/google", async (
    req,
    res,
    next) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.google.clientId,
        })

        const payload = ticket.getPayload();

        if (!payload) {
            res.status(400).send({error: "Invalid credential. Google login error!"});
            return;
        }

        const email = payload.email;
        const id = payload.sub;
        const firstName = payload.given_name;
        const lastName = payload.family_name;
        const phone = payload.iat;

        if (!email) {
            res.status(400).send({error: "No enough user data to continue!."});
            return;
        }

        let user = await User.findOne({googleId: id});

        if (!user) {
            user = new User({
                email: email,
                password: crypto.randomUUID(),
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                googleId: id,
            })
        }

        user.generateToken();
        await user.save();
        res.send({message: "Login with Google success!.", user});

    } catch (error) {

        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }

        next(error);
    }
})

usersRouter.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({error: 'An error occurred'});
    }
});

usersRouter.post('/register', async (req, res) => {
    try {
        const {firstName, lastName, email, phone, role, password} = req.body;

        if (firstName.trim() === '' || lastName.trim() === '') {
            res.status(400).send({error: 'First name and last name is required'});
            return;
        }

        if(password.trim() === '') {
            res.status(400).send({error: 'password is required'});
            return;
        }

        if( password.includes(' ')) {
            res.status(400).send({error: 'The password must not contain spaces.'});
            return;
        }

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

usersRouter.post('/sessions', async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        });

        if (!user) {
            res.status(404).send({error: 'Email Not Found'});
            return;
        }

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) {
            res.status(401).send({error: 'Password is incorrect'});
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

usersRouter.delete('/sessions', auth, async (req, res) => {
    let reqWithAuth = req as RequestWithUser;
    const userFromAuth = reqWithAuth.user;

    try {
        const user = await User.findOne({
            _id: userFromAuth._id,
        });

        if (!user) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        user.generateToken();
        await user.save();

        res.status(200).send({ message: 'Logout successful' });

    } catch (e) {
        res.status(400).send({error: 'An error occurred'});
    }

});

export default usersRouter;