import Job from "../models/jobModel.js";
import asyncHandler from "express-async-handler"
import User from "../models/UserModel.js";
export const createJob = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ auth0Id: req.oidc.user.sub });
        const isAuth = req.oidc.isAuthenticated() || user.email;
        if (!isAuth) {
            return res.status(401).json(
                {
                    message: "Not Authorized",
                });
        }
        const { title, description, location, salary, jobType, tags, skills, salaryType, negotiable } = req.body
        if (!title) {
            return res.status(400).json({ message: "Title is required" })
        }
        if (!description) {
            return res.status(400).json({ message: "Description is required" })
        }
        if (!location) {
            return res.status(400).json({ message: "Location is required" })
        }
        if (!salary) {
            return res.status(400).json({ message: "salary is required" })
        }
        if (!jobType) {
            return res.status(400).json({ message: "jobType is required" })
        }
        if (!skills) {
            return res.status(400).json({ message: "Skills is required" })
        }
        const job = new Job({
            title,
            description,
            location,
            salary,
            jobType,
            tags,
            skills,
            salaryType,
            negotiable,
            createdBy: user._id,
        })

        await job.save()
        res.status(201).json(job);
    } catch (error) {
        console.log("Error in createJob: ", error);
        return res.status(500).json(
            {
                message: "Server Error",
            });
    }
});






export const getJobs = asyncHandler(async (req, res) => {
    try {
        const jobs = await Job.find({})
        .populate("createdBy", "name profilePicture")
        .sort({ createdAt: -1 }); // sort by latest jobs
        return res.status(200).json(jobs);
    } catch (error) {
        console.log("Error in getting Jobs: ", error);
        return res.status(500).json(
            {
                message: "Server Error",
            });
    }
});



// get job by user

export const getJobsByUser = asyncHandler( async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ message: "User not found"});
        }
        const jobs = await Job.find({ createdBy: user._id})
        .populate("createdBy", "name profilePicture")
        return res.status(200).json(jobs);
    } catch (error) {
        console.log("Error in getting Job: ", error);
        return res.status(500).json(
            {
                message: "Server Error",
            });
    }
});


export const searchJobs = asyncHandler( async (req, res) => {
    try {
        const {title, location, tags} = req.query;
        let query = {};
        if(tags) {
            query.tags = { $in: tags.split(",") }
        }
        if(location) {
            query.location = { $regex: location, $options: "i" }
        }
        if(title) {
            query.title = { $regex: title, $options: "i" }
        }

        const jobs = await Job.find(query).populate("createdBy", "name profilePicture")
        return res.status(200).json(jobs);
    } catch (error) {
        console.log("Error in Job search: ", error);
        return res.status(500).json({
                message: "Server Error",
            });
    }

})



export const applyJob = asyncHandler( async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if(!job) {
            return res.status(404).json({ message: "Job not found"});
        }

        const user = await User.findOne({ auth0Id: req.oidc.user.sub});
        if(!user) {
            return res.status(404).json({ message: "User not found"});
        }

        if(job.applicants.includes(user._id)){
            return res.status(400).json({ message: "Already applied for this job"});
        }

        job.applicants.push(user._id);

        await job.save();
        return res.status(200).json(job);

    } catch (error) {
        console.log("Error in apply for job: ", error);
        return res.status(500).json({
                message: "Server Error",
            });
    }
})




export const likeJob = asyncHandler( async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if(!job) {
            return res.status(404).json({ message: "Job not found"});
        }

        const user = await User.findOne({ auth0Id: req.oidc.user.sub});
        if(!user) {
            return res.status(404).json({ message: "User not found"});
        }

        const isLiked = job.likes.includes(user._id)
        if(isLiked) {
            job.likes = job.likes.filter(like => !like.equals(user._id))
        }else {
            job.likes.push(user._id);
        }

        await job.save();
        return res.status(200).json(job);
        
    } catch (error) {
        console.log("Error like job: ", error);
        return res.status(500).json({
                message: "Server Error",
            });
    }
})


export const getJobById = asyncHandler( async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("createdBy", "name profilePicture");
        if(!job) {
            return res.status(404).json({ message: "Job not found"});
        }
        return res.status(200).json(job);
    } catch (error) {
        console.log("Error getjobby Id: ", error);
        return res.status(500).json({
                message: "Server Error",
            });
    }
})


export const deleteJob = asyncHandler( async (req, res) => {
    try {
        const { id } = req.params 
        const job = await Job.findById(id);
        const user = await User.findOne({ auth0Id: req.oidc.user.sub});
        if(!job) {
            return res.status(404).json({ message: "Job not found"});
        }

        if(!user) {
            return res.status(404).json({ message: "User not found"});
        }
        await Job.deleteOne({
            _id: id
        })
        return res.status(200).json({ message: "Job deleted successfully!"});
    } catch (error) {
        console.log("Error getjobby Id: ", error);
        return res.status(500).json({
                message: "Server Error",
            });
    }
})