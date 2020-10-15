require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { connectToDB } = require('./utils/db');
const errorHandler = require('./middlewares/errorHandler');

const createTaskData = require('./utils/createTaskData');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({exposedHeaders: 'X-Auth-Token'}));
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

connectToDB()
  .then(() => {
    console.log('DB Connected');
    app.listen(PORT, () => {
      console.log(`Server is listen on PORT: ${PORT}`);
    });
    // create task data for testing
    // createTaskData(10);
  })
  .catch(e => {
    console.log('DB Connection Failed');
    console.error(e.message);
    process.exit(1);
  });

