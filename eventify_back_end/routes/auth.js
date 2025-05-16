const express = require("express");
const router = express.Router();
const User = require("../models/User")
const { body , validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); // for hashing and adding salt and paper to our plain paassword
const jwt = require('jsonwebtoken'); // for the JWT auth token for the sessions // for the sending of token we will sign it , 
const fetchuser = require("../middleware/fetchuser")
const JWT_STRING = process.env.JWT_SECRET // secret key for the auth token put into secure files


// now first create a route to make sure the user can signup to the website 

// we are gona register a user here and it dont require the auth , now we are gona add some checks like as now we can send json wihtout username and it is givin us erors we dont want erros
// so we are gona use express validator // and we write it in the [] between two commans  "/" , [checks] , (req , res)
router.post('/createuser' , [
    body('name' , 'please enter a valid name').isLength({min:'3'}), //we can also add a custom message ('name', 'message') 
    body('password' , 'please enter a valid password').isLength({min:'5'}),
    body('email' , 'please enter a valid email').isEmail()
] , async(req , res)=>{
    // const user = new User(req.body) // create a user according to schema
    // user.save(); // save it into the data base
    // resp.send(req.body)
    // console.log("we are hittig the request at this api")
    let success = false ;
    const errors = validationResult(req); // Ensure `req` is passed correctly
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Properly structure the response
    }

    try{
        // we will use async await here and the user  is created and stored into the data base
        let user = await User.findOne({email:req.body.email})
        if(user)
        {
            return res.status(404).json({error:"user with this email already exists"})
        }

        const salt = bcrypt.genSaltSync(10);
        const secPassword = await bcrypt.hash(req.body.password , salt);
        user = await User.create({
            name:req.body.name,
            password:secPassword ,
            email:req.body.email
        })
        const data = { // as we have index on id , so the retrival based on id will be the fastest
            user:{
                id:user.id 
            }
        }
        const jwt_auth_token = jwt.sign(data , JWT_STRING)
        success = true ;
        res.json({success , jwt_auth_token : jwt_auth_token })
        // res.send(user)// instead of sending the user we will send the token 
    }catch(error)
    {
        console.error(error.message)
        res.status(500).json({error:"internal server eror"})
    }
     
})



// now we are gona create a long route for the user to login ok
// now create a endpoint for the login of the user 
router.post('/login' , [
    body('email' , 'please enter a valid email').isEmail() ,
    body('password' , 'please enter a valid password').exists()
] , async(req , res)=>{

    let success = false ;
    const errors = validationResult(req); // Ensure `req` is passed correctly
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Properly structure the response
    }

    const { email , password} = req.body ;
    try {
        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({error : "please login with correct credentials"})
        }

        const passwordCompare = await  bcrypt.compare(password , user.password);

        if(!passwordCompare)
        {
            return res.status(400).json({error : "please login with correct credentials"})
        }

        const data = { // as we have index on id , so the retrival based on id will be the fastest
            user:{
                id:user.id 
            }
        }
        
        const jwt_auth_token = jwt.sign(data , JWT_STRING)
        success = true ;
        res.json({success , jwt_auth_token : jwt_auth_token })



    } catch(error)
    {
        console.error(error.message)
        res.status(500).json({error:"internal server eror"})
    }
    

})







module.exports = router; 
