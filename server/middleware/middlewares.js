const allowUserView = (roles) => {
    return (req,res,next) => {
        const { role } = req.query;
        next()
        // if(roles.includes(role)) {
        //     next()
        // } else {
        //      res.status(401).json({ mssg: 'You are not authorized to view this page', redirect: '/' });
        // }
        

    }
}

const allowUserAction = (roles) => {
    return (req,res,next) => {
        const role = req.body.role;
        
        if(roles.includes(role)) {
            next();
        } else {
            res.status(401).json({ mssg: 'You are not authorized to do this action', redirect: '/' });
        }
    }
}


module.exports = { allowUserView,allowUserAction };