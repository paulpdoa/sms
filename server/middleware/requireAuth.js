const jwt = require('jsonwebtoken');
const User = require('../model/Users');

const requireAuth = async (req,res,next) => {

    const { auth } = req.headers;

    if(!auth) {
        return res.status(401).json({ err: 'Authorization token required' });
    }

    const token = auth.split(' ')[1];

    try { 
        const { _id } = jwt.verify(token,process.env.SECRET);
        req.user = await User.findOne({ _id }).select('_id');
        next(); 
    } catch(err) {
        console.log(err);
        res.status(401).json({ err: 'Request is not authorized' });
    }
}

module.exports = requireAuth;

