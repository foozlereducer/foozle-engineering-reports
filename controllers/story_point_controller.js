import { connectDB } from '../datatabase/db.js';
import { Sprint } from '../models/sprint.js';
import { logger } from '../services/logger.js';
import { getErrorSeverity } from '../services/errorSeverity.js'


export const index = async (req, res, next) => {
    res.render('metrics', { title: 'ACTO Product & Engineering Metrics' });
};


export const story_point_get = async (req, res) => {
    console.log('Made it to story_point_get')
    res.send('Made it to story_point_get');
}

export const story_points_create_post = async (req, res) => {
    connectDB();
    let storyPoints = new StoryPoints({
        sprint: req.body.sprint,
        issues: req.body.issues 
    })

    // try {
    //     const savedStoryPoint = await storyPoints.save();
    //     res.send(savedStoryPoint)
    // } catch(e) {
    //     const severity = getErrorSeverity(res.status);
    //     await logger(500, e, severity)
    //     res.send(e)
    // }
    res.send('Made it to story_point_post');
};



export const story_points_delete_post = async (req, res, next) => {
    res.send("Story Points Delete Range By IDs Not Implements")
};

export const story_points_update_post = async (req, res, next) => {
    res.send("Story Points Update By ID Not Implements")
};