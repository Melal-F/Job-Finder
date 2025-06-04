import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Job from '../models/jobModel.js';
import mongoose from 'mongoose';


export const createJob = asyncHandler(async(req,res) => {
    try {
        const user = await User.findOne({auth0Id: req.oidc.user.sub});

        const{ title, location, salary, salaryType, negotiable, jobType, description, tags, skills } = req.body;

        if(!title || !location || !salary || !salaryType || !jobType || !description) {
            return res.status(400).json({
                message: "Please fill all the required fields"
            })
        }

        const job = new Job(
            {
            title,
            location,
            salary,
            salaryType,
            negotiable,
            jobType,
            description,
            tags,
            skills,
            createdBy: user._id
        }
    );
        await job.save();

        return res.status(201).json({
            message: "Job created successfully",
            job
        })

    } catch (error) {
        console.log("Error in createJob", error);

        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

//get jobs
 export const getJobs = asyncHandler(async(req,res) => {
    try {
        const job = await Job.find({}).populate("createdBy" , " name profilePicture ")
        //sort by latest job created
        .sort({createdAt: -1});

        res.status(200).json(job);
    } catch (error) {
        console.log('error getJobs', error);    
        return res.status(500).json({
            message:'server ERROR'
        })
    }
 })

 //get jobs by user
export const getJobsByUser = asyncHandler(async(req, res) =>{

    try {
        const user = await User.findById(req.params.id);
    if(!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const jobs = await Job.find({createdBy: req.params.id}).populate("createdBy", "name profilePicture").sort({createdAt: -1});

    return res.status(200).json(jobs); 

    } catch (error) {
        console.log("Error in getJobsByUser", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }

})

//search jobs
export const searchJobs = asyncHandler(async(req, res) => {
    try {
        const {tags, location, title} = req.query;

        let query = {};

        if(tags){
            query.tags = { $in: tags.split(",") }
        }

        if(location){
            query.location = { $regex: location, $options: "i" }
        }

        if(title){
            query.title = { $regex: title, $options: "i" }
        }

        const jobs = await Job.find(query).populate("createdBy", "name profilePicture");
        console.log("jobs", jobs);
        return res.status(200).json(jobs);
    } catch (error) {
        console.log("Error in searchJobs", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})
//apply Job
export const applyJob = asyncHandler(async(req, res) => {
    try {
        const job  = await Job.findById(req.params.id);

        if(!job) {
            return res.status(404).json({
                message: "Job not found"
            })
        }

        const user = await User.findOne({auth0Id: req.oidc.user.sub});

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        if(job.applicants.includes(user._id)){
            return res.status(400).json({
                message:'Already applied for this job'
            })
        }

        job.applicants.push(user._id);

        await job.save();

        return res.status(200).json(job);
    } catch (error) {
        console.log("Error in applyJob", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}) 
//like and unlike
export const likeJob = asyncHandler(async(req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if(!job) {
            return res.status(404).json({
                message: "Job not found"
            })
        }
        const user = await User.findOne({auth0Id: req.oidc.user.sub});
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isLiked = job.likes.includes(user._id);

        if(isLiked)
        {
            job.likes = job.likes.filter((like) => !like.equals(user._id));
        }else
        {
            job.likes.push(user._id);
        }

        await job.save();
        return res.status(200).json({
            message: isLiked ? "Job unliked" : "Job liked",
            job
        })

    } catch (error) {
        console.log("Error in likeJob", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

//get job by ID
export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid job ID format" });
        }

        const job = await Job.findById(id).populate("applicants", "name profilePicture");

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json(job);
    } catch (error) {
        console.error("Error in getJobById:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteJob = asyncHandler(async(req, res) => {
    try {
        const{ id } = req.params;
        const job = await Job.findById(id);
        const user = await User.findOne({auth0Id: req.oidc.user.sub});
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if(!job) {
            return res.status(404).json({
                message: "Job not found"
            })
        }

        await job.deleteOne({
            _id: id
        })

        return res.status(200).json({
            message: "Job deleted successfully"
        })
    } catch (error) {
        console.log("Error in deleteJob", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})