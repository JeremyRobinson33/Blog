const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to my Digital Design blog. Here I post all my work for FA 27 spring 2019 @ Hofstra University. \n I am currently researching Invasion of Privacy by Technology \n Enjoy!";
const aboutContent = "Hi I'm Jeremy.  I am in my Junior year majoring in Computer Science and minoring in Mathematics. Check out my website: https://jeremyrobinson.herokuapp.com";
const contactContent = "Email: jeremydrobinson33@gmail.com";

const app = express();

var port = process.env.PORT || 3003;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://'+process.env.adminName+':'+process.env.adminPassword+'@cluster0-gorbh.mongodb.net/blogDB',{useNewUrlParser:true});

const postSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Post = new mongoose.model('Post',postSchema);

app.get('/', function(req,res) {
  Post.find({}, function(err, posts){
    if(!err){
      res.render('home', {homeStartingContent:homeStartingContent,posts:posts});
    }
  });
});

app.get('/about', function(req,res) {
  res.render('about', {aboutContent:aboutContent});
});

app.get('/contact', function(req,res) {
  res.render('contact', {contactContent:contactContent});
});

app.get('/compose', function(req,res) {
  res.render('compose');
});

app.get('/posts/:postId', function(req,res) {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render('post', {postTitle:post.title,postBody:post.body});
  });
});

app.post('/compose', function(req,res) {
  const post = new Post({
    title: req.body.journalTitle,
    body: req.body.journalBody
  });

  post.save(function(err){
    if(!err) {
      res.redirect('/');
    }
  });
});

app.listen(port, function() {
  console.log("Server started on port: " + port);
});
