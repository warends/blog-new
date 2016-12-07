var mongoose = require('mongoose');

var postSchema = new mongoose.Schema ({
  title: { type: String, required: '{PATH} is required', unique: true },
  slug: {type: String, required: '{PATH} is required', unique: true},
  categories: [String],
  headerImage : {data: Buffer, contentType: String},
  excerpt: { type: String, required: '{PATH} is required' },
  body: { type: String, required: '{PATH} is required' },
  author: { type: String, required: '{PATH} is required' },
  postedDate: { type: Date, default: Date.now}
});

var Post = mongoose.model('Post', postSchema);


function createDefaultPost(){
  Post.find({}).exec(function(err, collection){
    if(collection.length === 0){
      Post.create({
        title: 'What is your process?',
        slug: 'what-is-your-process',
        categories: ['process'],
        excerpt : "Walking into a client without a predefined process can lead to nightmares, so being prepared and the ability to stay flexible is critical to delivering a product you can be proud of and hitting their deadlines!",
        body: "<p>After working for a myriad of clients over the past couple of years, some industry veterans and others working through their first website, I have come to realize how important refining the development process can be.  Walking into a client without a predefined process can lead to nightmares, so being prepared and the ability to stay flexible is critical to delivering a product you can be proud of and hitting their deadlines!</p>" +
        "<p>The three fundamental aspects to managing a project are scope, time, and resources.  Each must be defined with the client at the start of the project, all aspects cumulating in delivering a quality product.</p>" + "<p>Scope:  Build a list of all the must-have features the client is looking to have with the project.  This will be the base scope.  Also build a list of nice-to-have features which can be implemented in a ‘beta’ version or if things are moving along quickly. </p>"+
        "<p>Time:  What is the client’s must hit deadline?  Do they want to roll out with a minimum viable product (MVP) or launch with all features implemented?</p>"+
        "<p>Resources:  Are you the only developer and or designer on the project or are you working with a well-oiled team?  If you are short staffed to hit a deadline, is there a budget to bring on another developer?</p>"+
        "<div class='triangle padded'><img src='http://res.cloudinary.com/willarendsdesign-com/image/upload/v1473793658/project-triangle_uycvs6.png' class='img-responsive'/></div>"+
        "<p>Taking these three into account, you should come out with a well-defined map to success.  The must-have features, must hit deadline, and pooling your available resources and money together to get the job done.</p>"+
        "<p>The biggest takeaway is the importance of communicating with the client on sticking to your map!  As any aspect of the triangle changes mid-project, the other two must be adjusted accordingly, or the final deliverable’s quality will suffer.  E.g. the client’s competitor adds chat bot functionality to their website, and they want to follow suit two weeks before the deadline. Now you are running into scope creep with the newly added functionality. Be clear and communicate with the client on the possible outcomes by adding this new feature.   Either you must cut some of the must-have features, bring in another developer to get the extra work done, or push back the deadline. One way or another, all corners of the map will change.  Many times I have found the client just wants to add to the scope without sacrificing any other aspects of the project with the mentality ‘just get it done’.  This is where the final product can really suffer and may end up delivering a product that you don’t want to put you name on!</p>" ,

        author: 'Will Arends',
        postedDate: new Date('08/25/16')
      });
    }
  });
};

module.exports = {
  Post : Post,
  createDefaultPost: createDefaultPost
}
