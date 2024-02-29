const express = require("express");
const mongoose = require("mongoose");
const app = express();
const BlogPost  = require("./blogPost.js");

app.use(express.json());

const uri =
  "mongodb+srv://carlodugo10:C1DvAKNeLMVjvc1l@cluster0.kf7urtx.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

app.post('/posts', async (req, res) => {
    try {
      const post = new BlogPost({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
        createdAt: Date.now(), // Use provided createdAt or default to now
      });
      await post.save();
      res.status(201).send(post);
    } catch (error) {
      res.status(400).send(error.message);
    }
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await BlogPost.find();
        return res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/posts/:id', async (req, res) => {
    try {
      const post = await BlogPost.findById(req.params.id);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      return res.status(200).send(post);
    } catch (error) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID format.');
      }
      res.status(500).send(error.message);
    }
});

app.delete('/posts/:id', async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID format.');
      }
      const post = await BlogPost.findByIdAndDelete(req.params.id);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      return res.status(200).send(`Successfully deleted post with id ${req.params.id}`);
    } catch (error) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID format.');
      }
      res.status(500).send(error.message);
    }
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
});