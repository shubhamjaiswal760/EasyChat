import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js"
import { io, userSocketMap } from "../server.js";
import { translateText, detectLanguage } from "../lib/translator.js";


// Get all users except the logged in user
export const getUsersForSidebar = async (req, res)=>{
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        // Count number of messages not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get all messages for selected user
export const getMessages = async (req, res) =>{
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        })
        
        // Get current user's language preference
        const currentUser = await User.findById(myId);
        const userLanguage = currentUser.preferredLanguage;

        // Translate messages if user has language preference other than default
        let translatedMessages = messages;
        
        if (userLanguage !== 'default') {
            translatedMessages = await Promise.all(
                messages.map(async (message) => {
                    // Only translate messages that were received by current user (not sent by them)
                    // and only translate text messages
                    if (message.receiverId.toString() === myId.toString() && message.text) {
                        try {
                            const detectedLanguage = await detectLanguage(message.text);
                            
                            // Translate only if detected language is different from user's preference
                            if (detectedLanguage !== userLanguage) {
                                const translatedText = await translateText(message.text, userLanguage, detectedLanguage);
                                return {
                                    ...message.toObject(),
                                    text: translatedText,
                                    isTranslated: translatedText !== message.text
                                };
                            }
                        } catch (translationError) {
                            console.error('Translation error for message:', message._id, translationError);
                        }
                    }
                    return message.toObject();
                })
            );
        }

        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});

        res.json({success: true, messages: translatedMessages})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res)=>{
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Send message to selected user
export const sendMessage = async (req, res) =>{
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        // Create and save the original message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // Get receiver's language preference
        const receiver = await User.findById(receiverId);
        const receiverLanguage = receiver.preferredLanguage;

        let translatedText = text;
        
        // If receiver has a language preference other than default and message has text
        if (receiverLanguage !== 'default' && text) {
            try {
                // Detect the original language
                const detectedLanguage = await detectLanguage(text);
                
                // Translate only if detected language is different from receiver's preference
                if (detectedLanguage !== receiverLanguage) {
                    translatedText = await translateText(text, receiverLanguage, detectedLanguage);
                }
            } catch (translationError) {
                console.error('Translation error:', translationError);
                // If translation fails, send original text
                translatedText = text;
            }
        }

        // Create message object to send to receiver (with translated text if applicable)
        const messageForReceiver = {
            ...newMessage.toObject(),
            text: translatedText,
            isTranslated: translatedText !== text
        };

        // Emit the translated message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", messageForReceiver)
        }

        // Send original message back to sender
        res.json({success: true, newMessage});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}