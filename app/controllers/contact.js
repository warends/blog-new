var nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'willarends@gmail.com',
        pass: process.env.GMAIL_KEY
      }
    });


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
