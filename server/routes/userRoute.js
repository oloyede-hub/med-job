 import express from "express"
import { getUserProfile } from "../controllers/userContoller.js";

 const router = express.Router();

router.get("/check-auth", (req, res) => {
    if(req.oidc.isAuthenticated()) {
        return res.status(200).json({auth: true, user: req.oidc.user})
    }else {
        return res.status(200).json(false);
    }
})

router.get("/user/:id", getUserProfile)

 export default router;