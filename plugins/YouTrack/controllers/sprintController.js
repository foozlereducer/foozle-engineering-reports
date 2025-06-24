import { logger } from '../../../services/logger.js';

export const getSprint = (sprintInstance) => async (req, res, next) => {
    try {
        
    } catch (error) {
        await logger(
            299, 
            'The sprint could not be retrieved or found', 
            'warn', 
            error
        );
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
    }
}

export const getProjects = (sprintInstance) => async (req, res, next) => {
    const sp = sprintInstance;
    const projs = await sp.getProjects()
    res.status(200).json(projs)
}

export const getBoardIds = (sprintInstance) => async (req, res, next) => {
    const sp = sprintInstance;
    const boardIds = await sp.getBoardIds()
    res.status(200).json(boardIds)
}
