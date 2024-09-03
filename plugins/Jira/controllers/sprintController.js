export const triggerNewSprint = (sprintInstance) => async (req, res, next) => {
    try {
        const { boardId } = req.query;
        const sp = sprintInstance;
        const result = await sp.createSprint(boardId);
        console.log('in Sprint controller', result)
        // Send the result back as JSON
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in triggerNewSprint:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

