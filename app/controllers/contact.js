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
    to: 'info@willarendsdesign.com',
    subject: 'Message from ' + data.contactName,
    //text: data.contactMessage,
    html: data.contactMessage + '<br><br><p>Email: ' + data.contactEmail + '</p><p>Name: ' + data.contactName + '</p>'
  }


  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      res.json({yo: 'error'});
    } else {
      console.log('Message Sent: ' + info.response);
      res.json(data);
    }
  });

  //res.json(data);
};
