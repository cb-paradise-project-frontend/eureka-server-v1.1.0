const { func } = require('joi');
const ses = require('node-ses');
const client = ses.createClient({
  key: 'AKIAIDAF6MQXZEYHBHNQ',
  secret: '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',
  amazon: 'https://email.ap-southeast-2.amazonaws.com',
});

// client.sendEmail({
//   to: 'wenpeijs@gmail.com',
//   from: 'wenpeijs@gmail.com',
//   cc: '',
//   subject: 'eureka reset password',
//   message: '<p>follow link will expired in 20 minutes</p>',
//   altText: 'follow link will expired in 20 minutes'
// }, function(err, data, res) {
//   console.log(err, data, res);
// });

const SESSendEmail = (emailAddress, token) => {
  console.log(1888, emailAddress, token);
  const content = `http://localhost:3000/reset-password?token=${token}`;

  client.sendEmail({
    to: emailAddress,
    from: 'wenpeijs@gmail.com',
    subject: 'Password reset link from Eureka',
    message: `<p>follow link will expired in 20 minutes: ${content}</p>`,
    altText: `follow link will expired in 20 minutes:${content}`
  }, (err, data, res) => {
    console.log(1111, err);
    console.log(2222, data);
    console.log(3333, res);
  })
};
// sendEmail('wenpeiwaynezhang@gmail.com', 'bscusnfagaelrucg');
module.exports = { SESSendEmail };
