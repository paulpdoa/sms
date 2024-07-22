const Session = require('../model/SchoolYear');

const allowUserView = (roles) => {
    return (req,res,next) => {
        const { role } = req.query;
        
        if(roles.includes(role)) {
            next()
        } else {
             res.status(401).json({ mssg: 'You are not authorized to view this page', redirect: '/' });
        }
        

    }
}

const allowUserAction = (roles) => {
    return async (req,res,next) => {
        const role = req.body.role;
        const session = req.body.session;

        const currentSessionYear = await Session.findOne({ _id: session });
        console.log(currentSessionYear);
        // If false = ongoing, if true = done
        const isYearDone = currentSessionYear.isYearDone;

        if(!isYearDone) {
            if(roles.includes(role)) {
                next();
            } else {
                res.status(401).json({ mssg: 'Your role is not authorized to do this action, please contact administrator', redirect: '/' });
            }   
        } else {
            res.status(401).json({ mssg: 'You are not allowed to add/edit/delete records in finished school year', redirect: '/' });
        }
        
    }
}


module.exports = { allowUserView,allowUserAction };