require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs"); // If using YAML specification file
const swaggerDocument = YAML.load("./swagger.yml");

const { Post } = require("./db/connection.js");
const { scrapeLatestPost } = require("./utils/twitter.js");
const { saveImageFromUrl } = require("./utils/img_save.js");

const app = express();
const port = 4000; //process.env.PORT || 3000;

app.get("/posts/", async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const offset = (pageNumber - 1) * pageSize;

  try {
    // Fetch all posts from your data source
    const posts = await Post.findAll({
      offset,
      limit: pageSize,
    });

    // Send the posts as a JSON response
    res.json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
});

app.get("/save-image/", async (req, res) => {
  try {
    await saveImageFromUrl(post.image, `image_${post.id}.png`);
    // Log the newly created post as a confirmation
    console.log(`Image posted: image_${post.id}.png`);
  } catch (error) {
    console.error("Error creating new post:", error);
  }
});

app.get("/get-latest-post-periodically/", async (req, res) => {
  // Schedule the cron job to run every 2 minutes
  cron.schedule("*/2 * * * *", async () => {
    try {
      // Add your existing code here
      const post = await scrapeLatestPost();
      const newPost = await Post.create({
        id: post.id,
        likes: post.likes,
        comments: post.comments,

        text: post.text,
      });
      // save image to local disk in current dir
      saveImageFromUrl(post.image, `image_${post.id}.png`);
      // Log the newly created post as a confirmation
      console.log("New post created:", newPost);
    } catch (error) {
      console.error("Error creating new post:", error);
    }
  });
});

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
