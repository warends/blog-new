var nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'willarends@gmail.com',
        pass: 'Stapless!'
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

exports.newMessage = function(req, res){
  //not req and res, should be comment data?
  var data = req.body;
  var mailOptions = {
    from: 'info@willarendsdesign.com',
    to: 'willarends@gmail.com',
    subject: 'You Have a New Comment on Your Post',
    //text: data.contactMessage,
    html: 'You Have a New Comment on Your Post<br><br><p>Name: ' + data.comment.firstName + ' ' + data.comment.lastName + '<br>Comment: ' + data.comment.contet + '</p>'
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
