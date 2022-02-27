const express = require("express");
const router = express.Router();

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

router.post("/add", async(req, res) => {

    const newMessage = new Message(req.body);
    console.log(req.body, newMessage)
    try {
        await newMessage.save();
        await Conversation.findByIdAndUpdate(req.body.conversationId, { message: req.body.text });
        res.status(200).json("Message has been sent successfully");
    } catch (error) {
        res.status(500).json(error);
    }

})

router.get("/:id", async(req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.id });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;