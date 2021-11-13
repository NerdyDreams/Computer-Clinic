const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
// const blog = require(__dirname + "/blog.js");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home.ejs")
})

app.get("/compose", function(req, res) {
  res.render("compose.ejs")
})

app.get("/services", function(req, res) {
  res.render("services.ejs")
})



//------ Computer Clinic blog--------------
const homeStartingContent = "Clinical computer solutions✔"
mongoose.connect("mongodb://localhost:27017/blogDB");

const ContentSchema = new mongoose.Schema({
  name: String,
  content: String
})
const Content = mongoose.model("Content", ContentSchema);

app.get("/blog", function(req, res) {

  Content.find({}, function(err, foundItems) {
    if (err) {
      console.log(err)
    } else {
      res.render("blog", {
        firstHeader: homeStartingContent,
        post: foundItems
      })
    }
  })
})

app.post('/compose', function(req, res) {

  const composedContent = new Content({
    name: _.capitalize(req.body.newDiary),
    content: req.body.diary
  })

  composedContent.save(function(err) {
    if (!err) {
      res.redirect("/blog")
    }
  })
})

app.get('/posts/:userId', function(req, res) {
  // console.log(req.params.userId)
  // returns true if userid matches article title in posts
  // let titlepost = postss.some( post => _.kebabCase(post['titleInput']) === _.kebabCase(req.params.userId))
  requestedTitle = _.capitalize(req.params.userId)
  Content.find({}, function(err, foundItems) {
    if (!err) {
      foundItems.forEach(function(post) {
        let storedTitle = post.name
        let storedDiary = post.content
        if (requestedTitle === storedTitle) {
          res.render("blogPosts", {
            requestedTitle: storedTitle,
            diaryMessage: storedDiary
          })
        }
      })
    }


  })
})

// --------Computer Clinic blog---------------







app.listen(3000, function() {
  console.log("Server started on port 3000");
});
