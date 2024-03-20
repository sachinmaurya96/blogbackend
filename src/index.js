import dotenv from 'dotenv';
import { connectDb } from './db/index.js';
import { app } from './app.js';
dotenv.config({
  path: './.env',
});
const port = process.env.PORT || 8000;
connectDb()
  .then(() => {
    app.get('/', (req, res) => {
      res.send('Hello World')
    })
    app.listen(port, () => {
      console.log(`server is running on port ${port} `);
    });
  })
  .catch((error) => {
    console.log('mongodb connection failed ', error);
  });
