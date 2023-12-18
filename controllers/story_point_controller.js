import mongoose from 'mongoose';
import {StoryPoints} from '../models/storyPoints.js';

export const index = async (req, res, next) => {
    res.render('metrics', { title: 'ACTO Product & Engineering Metrics' });
};


export const story_point_get = async (req, res) => {
    console.log('Made it to story_point_get')
    res.send('Made it to story_point_get');
}

export const story_points_create_post = async (req, res) => {
    let storyPoints = new StoryPoints({
        sprint: req.body.sprint,
        issues: req.body.issues 
    })

    try {
        const savedStoryPoint = await storyPoints.save();
        res.send(savedStoryPoint)
    } catch(e) {
        console.log(e);
        res.status(500)
        res.send(e)
    }
    
};



export const story_points_delete_post = async (req, res, next) => {
    res.send("Story Points Delete Range By IDs Not Implements")
};

export const story_points_update_post = async (req, res, next) => {
    res.send("Story Points Update By ID Not Implements")
};