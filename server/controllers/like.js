import video from "../Modals/video.js";
import like from "../Modals/like.js";
import users from "../Modals/Auth.js";
import mongoose from "mongoose";

export const handlelike = async (req, res) => {
    const { userId } = req.body;
    const { videoId } = req.params;
    try {
        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(401).json({ message: "Sign in to like videos" });
        }
        if (!videoId || !mongoose.isValidObjectId(videoId)) {
            return res.status(400).json({ message: "Invalid video" });
        }
        const [user, targetVideo] = await Promise.all([
            users.exists({ _id: userId }),
            video.exists({ _id: videoId }),
        ]);
        if (!user) {
            return res.status(401).json({ message: "Sign in to like videos" });
        }
        if (!targetVideo) {
            return res.status(404).json({ message: "Video not found" });
        }
        const exisitinglike = await like.findOne({
            viewer: userId,
            videoid: videoId,
        });
        if (exisitinglike) {
            await like.findByIdAndDelete(exisitinglike._id);
            await video.findByIdAndUpdate(videoId, { $inc: { Like: -1 } });
            return res.status(200).json({ liked: false });
        } else {
            await like.create({ viewer: userId, videoid: videoId });
            await video.findByIdAndUpdate(videoId, { $inc: { Like: 1 } });
            return res.status(200).json({ liked: true });
        }
    } catch (error) {
        console.error(" error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const getallLikedVideo = async (req, res) => {
    const { userId } = req.params;
    try {
        const likevideo = await like
            .find({ viewer: userId })
            .populate({
                path: "videoid",
                model: "videofiles",
            })
            .exec();
        return res.status(200).json(likevideo);
    } catch (error) {
        console.error(" error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
