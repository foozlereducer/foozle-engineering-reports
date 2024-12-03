/**
 * Ensure a user or system is authenticated
 * @param {*} req - request
 * @param {*} res - response
 * @param {*} next - next middleware or route
 * @returns 
 */
export function ensureAuthenticated(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, proceed to the next middleware
    } else {
      res.redirect('/login'); // Redirect to login page if not authenticated
    }
  } catch(error) {
    logger(400, 'error', error)
  }
}