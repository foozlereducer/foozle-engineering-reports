import { logger } from "../../../services/logger.js";

export const getSprint = (sprintInstance) => async (req, res, next) => {
    try {
        const { boardId } = req.query;
        const sp = sprintInstance;
        const result = await sp.consolidateSprint(boardId);
        // Send the result back as JSON
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in triggerNewSprint:', error);
        logger(500, 'error', error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
export const getSprintStoryPoints = (sprintInstance) => async (req, res, next) => {
    try {
        const { boardId } = req.query;
        const sp = sprintInstance;
        const sprintValues = await sp.consolidateSprint(boardId);
        
        // Send the result back as JSON
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in triggerNewSprint:', error);
        res.status(500).json({ message: 'Internal Server Error' });
        logger(500, 'error', error)
    }
}

export const getProjects = (sprintInstance) => async (req, res, next) => {
    try {
        const sp = sprintInstance;
        const projs = await sp.getProjects()
        res.status(200).json(projs)
    } catch(error) {
        logger(500, 'error', error)
        res.status(500).send({ error: 'Failed to fetch projects: ' + error.message });
    }
}

export const getBoardIds = (sprintInstance) => async (req, res, next) => {
    try {
        const sp = sprintInstance;
        const boardIds = await sp.getBoardIds()
        res.status(200).json(boardIds)
    } catch(error) {
        logger(500, 'error', error)
        res.status(500).send({ error: 'Failed to fetch boardIds: ' + error.message });
    }
}
