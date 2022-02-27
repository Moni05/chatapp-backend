const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/login", async(req, res) => {

    try{

        let userExist = await User.findOne({ googleId: req.body.googleId });

        if(userExist){
            return res.status(200).send("User logged in");
        }

        const newUser =  new User(req.body);
        await newUser.save();
        return res.status(200).send("User Saved");


    } catch(err){

        res.status(500).json(err);
    }
    
})


module.exports = router;