const jwt = require('jsonwebtoken');

const JWT_STRING = process.env.JWT_SECRET;

const fetchuser = (req , res , next) =>
{

    const token = req.header("auth-token");
    if(!token)
    {
        res.status(401).send({error : "please enter with a valid jwt token "})
    }
    try {
        const data = jwt.verify(token , JWT_STRING);
        req.user = data.user ;
        next();
    } catch (error) {
        res.status(401).send({error : "please enter with a valid jwt token "})
    }




    // next(); // the next is the (req , res) in  router.post('/login' ,fetchuser, async(req , res)=>{ // that means when the next is called we leave the function and next things can run
}

module.exports = fetchuser ;