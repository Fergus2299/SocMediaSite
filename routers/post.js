const express = require('express');
const router = express.Router();

const { Post } = require('../models');


router.post('/', async (req, res) => {
    try {
        const userId = req.user.userId;
        // console.log(`userid: ${userId}`);
        // Get post data from request body
        const { title, body } = req.body;
        // console.log(`title: ${title}`);
        // console.log(`body: ${body}`);
        
        const post = await Post.create({ title, body, userId });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: "Failed to create post" });
    }
});

router.get('/', async (req, res) => {
    try {
        // Get the userId from req.user
        const userId = req.user.userId;

        // Query the database for posts created by the user with that userId
        const userPosts = await Post.findAll({
            where: {
                userId: userId
            }
        });

        // Send the user's posts in the response
        res.json(userPosts); 
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

module.exports = router;