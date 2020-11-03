const mongoose = require('mongoose');

exports.connectToDB = () => {
  const { DB_HOST, DB_PORT, DB_DATABASE, DB_ATLAS } = process.env;
  const connectionString = `${DB_ATLAS}`;

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
