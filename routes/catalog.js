import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import {
    story_point_get, 
    story_points_create_post,
    story_points_delete_post
} from '../controllers/story_point_controller.js';
import { firebaseConfigGet } from '../controllers/firebaseConfigController.js';
const router = express.Router();



router.get("/", function (req, res) {
    res.redirect('http://localhost:5173')
})
// Route to get the Firebase Config. Called by the Vue 3 frontend app
.get("/firebaseConfig", firebaseConfigGet)


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
)


export {router as catalogRouter};