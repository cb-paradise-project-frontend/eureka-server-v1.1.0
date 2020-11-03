const { func } = require('joi');
const ses = require('node-ses');
const { key, secret } = process.env
const client = ses.createClient({
  key,
  secret,
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
  const content = `http://localhost:3000/reset-password?token=${token}`;

  client.sendEmail({
    to: emailAddress,
    from: 'wenpeijs@gmail.com',
    subject: 'Password reset link from Eureka',
    message: `<p>follow link will expired in 20 minutes: ${content}</p>`,
    altText: `follow link will expired in 20 minutes:${content}`
  }, (err, data, res) => {
    console.error('SES-Error', err);
    console.log('SES-SendSucceeded', data);
    console.log('response from SES', res);
  })
};
// sendEmail('wenpeiwaynezhang@gmail.com', 'bscusnfagaelrucg');
module.exports = { SESSendEmail };
