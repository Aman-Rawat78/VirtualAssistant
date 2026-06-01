import User from "../models/user.model.js";

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
       
        let assistantImage;

        if(req.file){
            assistantImage = await uploadOnCloudinary(req.file.path);
        }else{
            assistantImage = ImgUrl;
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        user.assistantName = AssistantName || user.assistantName;
        user.assistantImage = assistantImage || user.assistantImage;
        await user.save();
        res.status(200).json({message: "Assistant data updated successfully"});

    }catch(error){
        res.status(500).json({ message: `Error updating assistant data: ${error.message}` });
    }
 }