import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req,res) => res.render("join", {pageTitle:"Join"});
export const postJoin = async (req,res) => {
    const {name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.status(400).render("join", {pageTitle, errorMessage: "Password confirmation does not match."});
    }
    const exists = await User.exists({$or: [{username},{email}]});
    if(exists){
        return res.status(400).render("join", {pageTitle, errorMessage:"This username/email is already taken."});
    }

    try{
        await User.create({
            name, 
            username, 
            email, 
            password, 
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: "An unknown error has occurred"
        })
    }
    
};

export const getLogin = (req,res) => res.render("login", {pageTitle: "Login"});

export const postLogin = async (req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.status(400).render("login", {
            pageTitle: "Login",
            errorMessage: "An account with this username does not exists."
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {
            pageTitle: "Login",
            errorMessage: "Wrong Password"
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const logout = (req,res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getUploadmedia = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
};

export const postUploadmedia = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
};

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"})
};

export const postEdit = async (req, res) => {
    const {
        session: {
            user: {_id, avatarUrl},
        },
        body: {name, email, username, location},
        file,
    } = req;
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            avatarUrl: file ? file.path : avatarUrl,
            name,
            email,
            username,
            location,
        },
        { new:true }
    );
    console.log(file)
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};

export const see = (req,res) => res.send("See User");
export const remove = (req,res) => res.send("Delete User");