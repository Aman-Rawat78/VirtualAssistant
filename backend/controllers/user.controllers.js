import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import moment from "moment/moment.js";
import AskAssistant from "../gemini.js";

export const getCurrentUser = async (req, res) => {
    try {
        console.log("Fetching current user data...");
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `Error fetching user data: ${error.message}` });
    }
}

 export const updateAssistant = async (req,res)=>{
    try{
        const userId = req.userId;
        const{ AssistantName ,ImgUrl}= req.body;
        let AssistantImage;

        if(req.file){
            AssistantImage = await uploadOnCloudinary(req.file.path);
        }else{
            AssistantImage = ImgUrl;
        }

        const user = await User.findByIdAndUpdate(userId, { assistantName: AssistantName, assistantImage: AssistantImage },{ returnDocument: 'after' }).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);

    }catch(error){
        res.status(500).json({ message: `Error updating assistant data: ${error.message}` });
    }
 }


 
 export const AskToAssistant = async (req, res) => {
    try {
        const user  = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userName = user.name;
        const assistantName = user.assistantName;
        const {command} = req.body;
        
        const response = await AskAssistant(command, assistantName, userName);
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(400).json({ response: "Sorry, I couldn't understand that." });
        }

        const geminiResponse = JSON.parse(jsonMatch[0]);
        const type = geminiResponse.type;

        switch (type) { 
            case "get_date":
                return res.status(200).json({ type, userInput: geminiResponse.userInput, response: `Today is ${moment().format("MMMM Do YYYY")}` });
                break;
            case "get_time":
                return res.status(200).json({ type, userInput: geminiResponse.userInput, response: `The current time is ${moment().format("hh:mm A")}` });
                break;
            case "get_day":
                return res.status(200).json({ type, userInput: geminiResponse.userInput, response: `Today is ${moment().format("dddd")}` });
                break;    
            case "get_month":
                return res.status(200).json({ type, userInput: geminiResponse.userInput, response: `The current month is ${moment().format("MMMM")}` });
                break;
            case "google_search":
            case "youtube_search":
            case "youtube_play":
            case "weather_show":
            case "calculator_open":
            case "instagram_open":
            case "facebook_open":
            case "general":
                return res.json({ type, userInput: geminiResponse.userInput, response: geminiResponse.response });      
         
            default:
                return res.status(400).json({ response: "Sorry, I couldn't understand that." });
        }
    
    }catch (error) {
         // Catch 429 Rate Limit
    if (error.status === 429 || error.statusCode === 429) {
      console.warn('Gemini 429: Free tier quota reached.');
      return res.status(200).json({
        type: 'general',
        userInput: req.body.command || '',
        response: 'I am receiving too many requests right now. Please give me about thirty seconds to cool down.',
      });
    }
        console.error("Error occurred while asking assistant:", error);
        res.status(500).json({ response: `Error asking assistant: ${error.message}` });
    }
 }