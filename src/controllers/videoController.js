import Video from "../models/Video";


export const home = async(req, res) => {
    try {
        const videos = await Video.find({}).sort({createdAt: "descending"});
        return res.render("home", {pageTitle: "Home", videos});
    } catch {
        return res.render("server-error");
    }
    
};

export const watch = async (req, res) => {
    const { id } = req.params;
    //^^^ == const id = req.params.id;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", {pageTitle: "Video not found."}) 
    }
    return res.render("watch", {pageTitle: video.title, video});
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.exists({_id:id});
    if (!video) {
        return res.render("404", {pageTitle: "Video not found."});
    }
    return res.render("edit", {pageTitle: `Editing ${video.title}`, video});
};

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({_id:id});
    if (!video) {
        return res.render("404", {pageTitle: "Video not found."});
    }
    await Video.findByIdAndUpdate(id, {
        title, description, hashtags: Video.formatHashtags,
    });
    return res.redirect(`/videos/${id}`);
};

export const getUpload = async (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};
export const postUpload = async (req, res) => {
    const { title, description, hashtags } =req.body;
    try {
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    } catch(error){
        console.log(error);
        return res.render("upload", {pageTitle: "Upload Video"});
    }
};

export const deleteVideo = async (req, res) => {
    const {id} = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = (req, res) => {
    return res.render("search", {pageTitle: "Search"});
};