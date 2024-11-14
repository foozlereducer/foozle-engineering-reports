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
  .post("/api/v1/getSprint", (req, res) => getSprint(Sp)(req, res))
  .get("/api/v1/getProjects", async (req, res) => {
    try {
      const projects = await Sp.getProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Error fetching projects', error });
    }
  })
  .get("/api/v1/getBoardIds", async(req,res) => {
    try {
        const boardIds = await Sp.getBoardIds(validator);
        res.status(200).json(boardIds);
    } catch (error) {
        console.error('Error fetching boardIds:', error);
        res.status(500).json({ message: 'Error fetching boardIds', error });
    }
    
  })

  // GET /api/sprints/storypoints?startDate=2024-01-01&endDate=2024-02-28&boardIds=1,2,3 (optional boardIds)
  .get('/api/v1/sprints/storypoints', async (req, res) => {
    const { boardIds, startDate, endDate, isCore } = req.query;
   
    let boardIdArray;
    if (!boardIds) {
        // If no boardIds are provided, get them dynamically
        try {
            const validator = new ActoValidator(); // Assuming you have a validator instance
            boardIdArray = await Sp.getBoardIds(validator, { core: isCore === 'true' });
        } catch (error) {
            return res.status(500).send({ error: 'Error retrieving board IDs' });
        }
    } else {
        // Split boardIds if they are provided
        boardIdArray = boardIds.split(',').map(id => parseInt(id, 10));
        if (!Array.isArray(boardIdArray) || boardIdArray.some(isNaN)) {
            return res.status(400).send({ error: 'Invalid boardIds parameter' });
        }
    }

    try {
        console.log(boardIdArray, startDate, endDate, isCore)
        const committedStatuses = [
          'To Do',
          'In Progress',
          'Done',
          'Completed',
          'Released Into Pre-Production',
          'Ready For Release'
        ]
        Sp.addStatuses('committed', committedStatuses)

        const completedStatuses = [
            'Done',
            'Completed',
            'Released Into Pre-Production',
            'Ready For Release'
        ]
        Sp.addStatuses('completed', completedStatuses)
        
        const acceptedStatuses =['Accepted']
        Sp.addStatuses('accepted', acceptedStatuses)
        
        const totalStoryPoints = 
        await Sp.getTotalStoryPointsForSprintsInRange(boardIdArray,startDate, endDate);
        res.json({ totalStoryPoints });
    } catch (error) {
        res.status(500).send({ error: 'Error retrieving story points' });
    }
})


export { router as jiraMetricsRouter };