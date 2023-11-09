import express from 'express';
const router = express.Router();

// Get Story Point Reports
router.get("/", (req, res) => {
    res.render('story_points', { title: 'Story Points' });
})

export {router as storyPointsRouter};