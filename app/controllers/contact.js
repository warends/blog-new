var nodemailer = require('nodemailer');

var generator = require('xoauth2').createXOAuth2Generator({
  user: 'willarends@gmail.com',
  clientId: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_SECRET,
  refreshToken: '1/Q8J7ncJl9WqafJT1AhSirojrLF2HLZeY9LEvI_MvsQjOX9C1HiOzr0FhP_Si3GKL',
  accessToken: 'ya29.GlsWBFZmSut6xdXbPHG4Conerz62LEQi0vLdcqbNDll2-NKTRgsXGtQ4yZcwdKdhP_wzXubvGDpNEkxxRvYsUlApsmaFXPjXLzjvBzKrMFGi-zDfrngjs8xdxm1_'
});

// listen for token updates (if refreshToken is set) you probably want to store these to a db
generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});

var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          xoauth2: generator
      },
      debug: true
});

transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// transporter.sendMail({
//   from: 'sender@example.com',
//   to: 'willarends@gmail.com',
//   subject: 'Working',
//   text: 'This is never gonna work',
// });

exports.sendMail = function(req, res){
  var data = req.body;
  var mailOptions = {
    from: data.contactEmail,
    to: 'willarends@gmail.com',
    subject: 'Message from ' + data.contactName,
    //text: data.contactMessage,
    html: data.contactMessage + '<br><br><p>Email: ' + data.contactEmail + '<br>Company: ' + data.contactCompany + '<br>Name: ' + data.contactName + '</p>'
  }
  transporter.sendMail(mailOptions, function(err, info){
    if(err){
      console.log(err);
      res.json({message: err.toString()});
    } else {
      console.log('Message Sent: ' + info.response);
      res.json(data);
    }
  });

};

exports.newMessage = function(comment, title){
  var mailOptions = {
    from: 'info@willarendsdesign.com',
    to: 'willarends@gmail.com',
    subject: 'You Have a New Comment on Your Post',
    //text: data.contactMessage,
    html: 'You Have a New Comment on Your Post ' + title + '<br><br><p>Name: ' + comment.firstName + ' ' + comment.lastName + '<br>Comment: ' + comment.content + '</p>'
  }
  transporter.sendMail(mailOptions, function(err, info){
    if(err){
      console.log(err);
    } else {
      console.log('Message Sent: ' + info.response);
    }
  });

};
