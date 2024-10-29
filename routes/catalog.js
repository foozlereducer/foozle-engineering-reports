import express from 'express';
import {
    story_point_get, 
    story_points_create_post,
    index, 
    story_points_delete_post
} from '../controllers/story_point_controller.js'
import { verifyToken } from '../services/auth/JWT.js';

const router = express.Router();

router.get("/", index)

.get(
    "/v1/story_points/create",
    story_point_get
)

.post(
    ""
)
// POST request for creating Story Points.
.post(
    "/v1/story_points/create",
    story_points_create_post
)

// POST request to delete story points.
.post(
    "/v1/story_points/:id/delete", 
    story_points_delete_post
)

.get(
    "/v1/triggerCurrentSprintsCommittedStoryPoints",
    story_points_delete_post
)

export {router as catalogRouter};