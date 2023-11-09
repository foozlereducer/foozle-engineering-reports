import express from 'express';
const router = express.Router();
import {
    story_point_get, 
    story_points_create_post,
    index, 
    story_points_delete_post
} from '../controllers/story_point_controller.js'


router.get("/", index)

.get(
    "/story_points/create",
    story_point_get
)
// POST request for creating Story Points.
.post(
    "/story_points/create",
    story_points_create_post
)

// POST request to delete story points.
.post(
    "/story_points/:id/delete", 
    story_points_delete_post
);

export {router as catalogRouter};