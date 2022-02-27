const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.get("/", async(req, res) => {

    try{
        
        const user = await User.find({});
        res.status(200).json(user);

    } catch(err){

        res.status(500).json(err);
    }
    
})


module.exports = router;