const Session = require('../model/SchoolYear');
const multer = require('multer');


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
    return async (req, res, next) => {
      try {
        const role = req.body.role;
        const session = req.body.session;
        const currentSessionYear = await Session.findOne({ _id: session });
        console.log(session);
  
        if (!currentSessionYear) {
          return res.status(404).json({ mssg: 'Session not found', redirect: '/' });
        }
  
        // If false = ongoing, if true = done
        const isYearDone = currentSessionYear.isYearDone;
  
        if (!isYearDone) {
          if (roles.includes(role)) {
            next();
          } else {
            res.status(401).json({
              mssg: 'Your role is not authorized to do this action, please contact administrator',
              redirect: '/',
            });
          }
        } else {
          res.status(401).json({
            mssg: 'You are not allowed to add/edit/delete records in finished school year',
            redirect: '/',
          });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: 'An error occurred', error: error.message });
      }
    };
  };
  

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });


module.exports = { allowUserView,allowUserAction,upload };