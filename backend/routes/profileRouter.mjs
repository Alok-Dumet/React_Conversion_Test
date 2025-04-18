import express from 'express';

//router
const router = express.Router();

//router for profile page
router.get("/api/v1/profile", (req, res)=>{
    // console.log(req.user.password);
    res.render("profile", {layout: "layoutAllElse"});
})

export {
    router
}
