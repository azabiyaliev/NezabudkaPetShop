import express from 'express';

const app = express();
const port = 8000;

const run = async () => {

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

run().catch((err) => console.log(err));
