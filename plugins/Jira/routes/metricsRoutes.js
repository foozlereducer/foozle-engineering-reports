// Import dependencies
import express from 'express';
import { triggerNewSprint } from '../controllers/sprintController.js';
import { JiraRest } from '../services/jiraRest.js';
import { ActoValidator } from '../../../services/validators/ActoValidator.js';
import { Sprint } from '../services/Sprint.js';


const router = express.Router();

// Setup dependencies for the route handler
const jr = new JiraRest(new ActoValidator());
const Sp = new Sprint(jr);

// Register the route handler
router.post("/v1/triggerNewSprint", triggerNewSprint(Sp));

export { router as jiraMetricsRouter };
