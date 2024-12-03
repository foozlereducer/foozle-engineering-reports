import { logger } from "../services/logger.js";
/**
 * Trigger Sprint Committed Story Points is the first stage of collecting 
 * story points, so it will call the service to create the sprint record 
 * and list all the committed story points 
 * @param {object} Sp - Sprint service instance
 * @returns {function} Express route handler
 */
export const triggerSprintCommittedStoryPoints = (Sp) => async (req, res) => {
    try {
        const sprintData = await Sp.getSprints(167);
        res.send(sprintData);
    } catch (error) {
        console.error('Error in triggerSprintCommittedStoryPoints:', error);
        logger(400, 'error', error)
        res.status(500).send({ error: 'Failed to fetch sprint data' });
    }
};
