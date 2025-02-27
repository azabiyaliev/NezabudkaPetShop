import express from 'express';
import mongoose from "mongoose";
import config from "./config";
import usersRouter from "./routers/Users";

const app = express();
const port = 8000;

app.use(express.json());

app.use('/users', usersRouter);

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

run().catch((err) => console.log(err));
