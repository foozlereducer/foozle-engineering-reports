import express from 'express';
import {
    story_point_get, 
    story_points_create_post,
    index, 
    story_points_delete_post
} from '../controllers/story_point_controller.js'
import { firebaseConfigGet } from '../controllers/firebaseConfigController.js'
import { verifyToken } from '../services/auth/JWT.js';

const router = express.Router();

router.get("/", index)
.get("/firebaseConfig", verifyToken, firebaseConfigGet)

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