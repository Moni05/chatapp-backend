const express = require("express");
const router = express.Router();

const Conversation = require("../models/Conversation");

router.post("/new", async(req, res)=>{

    let senderId = req.body.senderId;
    let receiverId = req.body.receiverId;

    const exist = await Conversation.findOne({ members: { $all: [receiverId, senderId]  }})
    
    if(exist) {
        res.status(200).json('conversation already exists');
        return;
    }
    const newConversation = new Conversation({
        members: [senderId, receiverId]
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/get", async(req,res) =>{

    try {
        const conversation = await Conversation.findOne({ members: { $all: [ req.body.sender, req.body.receiver] }});
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error);
    }

})
module.exports = router;