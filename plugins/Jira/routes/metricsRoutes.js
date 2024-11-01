// Import dependencies
import express from 'express';
import { getSprint } from '../controllers/sprintController.js';
import { JiraRest } from '../services/jiraRest.js';
import { ActoValidator } from '../../../services/validators/ActoValidator.js';
import { Sprint } from '../services/Sprint.js';


const router = express.Router();
const validator = new ActoValidator();
// Setup dependencies for the route handler
const jr = new JiraRest(validator);
const Sp = new Sprint(jr);

// Register the route handler
router
  .post("/v1/getSprint", (req, res) => getSprint(Sp)(req, res))
  .get("/v1/getProjs", async (req, res) => {
    try {
      const projects = await Sp.getProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Error fetching projects', error });
    }
  })
  .get("/v1/getBoardIds", async(req,res) => {
    try {
        const boardIds = await Sp.getBoardIds(validator);
        res.status(200).json(boardIds);
    } catch (error) {
        console.error('Error fetching boardIds:', error);
        res.status(500).json({ message: 'Error fetching boardIds', error });
    }
    
  })

export { router as jiraMetricsRouter };