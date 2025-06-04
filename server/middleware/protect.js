// Middleware to protect routes
const protect = (req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

export default protect;