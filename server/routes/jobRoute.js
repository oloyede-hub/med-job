import express from "express"
import { applyJob, createJob, getJobs , getJobsByUser, searchJobs, likeJob, getJobById, deleteJob} from "../controllers/jobController.js";
import protect from "../middleware/protect.js";

const router = express.Router();


router.post("/jobs", protect, createJob);
router.get("/jobs", getJobs);
router.get("/jobs/user/:id", protect,  getJobsByUser);

// search job
router.get("/jobs/search",searchJobs);

// Apply for job
router.put("/jobs/apply/:id",protect, applyJob);

// Like and Unlike jobs
router.put("/jobs/like/:id",protect, likeJob);

// getJobById
router.get("/jobs/:id", protect, getJobById);

// deleteJob
router.delete("/jobs/:id", protect, deleteJob);

export default router;