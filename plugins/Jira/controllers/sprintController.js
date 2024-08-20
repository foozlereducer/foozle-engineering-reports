export const triggerNewSprint = (sprintInstance, boardId) => async (req, res, next) => {
    const sp = sprintInstance;
    const sprint = await sp.getSprint(boardId)
    console.log('sprint in triggerNewSprint controller', sprint)
    res.send(sprint)
}