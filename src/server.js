require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { connectToDB } = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

connectToDB()
  .then(() => {
    console.log('DB Connected');
    app.listen(PORT, () => {
      console.log(`Server is listen on PORT: ${PORT}`);
    });
  })
  .catch(e => {
    console.log('DB Connection Failed');
    console.error(e.message);
    process.exit(1);
  });