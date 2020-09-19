const mongoose = require('mongoose');

exports.connectToDB = () => {
  const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
  const connectionString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

  const db = mongoose.connection;
  db.on('connected', () => {
    console.log(`Connecting to ${connectionString}`);
  });
  db.on('error', (error) => {
    console.log('DB connection failed');
    console.error(error.message);
    process.exit(1);
  });
  db.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });

  mongoose.set('useFindAndModify', false);

  return mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};
