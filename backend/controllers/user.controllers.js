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

 