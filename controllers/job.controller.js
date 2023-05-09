const { Job } = require('../models/job.module');

const { JobCategory } = require('../models/jobCategory.module');

exports.createJob = async (req, res) => {
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(404).send('Job name is required');
        }

        const newJob = await Job.create({ name });

        res.json(newJob);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.createJobAndPushToCategory = async (req, res) => {
    const { name , imageUrl } = req.body;

    const category = req.params.category;

    try {
        if (!name || !category || !imageUrl) {
            return res.status(404).send('Job or Category or Image required');
        }

        const existingCategory = await JobCategory.findById(category);

        if (!existingCategory) {
            return res.status(404).send('Couldnt find a category');
        }

        const existingJob = await Job.findById(category);

        if (existingJob) {
            return res.status(400).send('Job already exists');
        }

        const newJob = await Job.create({ name, category , imageUrl });

        existingCategory.jobs.push(newJob._id);

        await existingCategory.save();

        res.status(200).json(existingCategory);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getSpecificJob=async(req,res)=>{
    const jobId=req.params.job;

    if(!jobId){
        return res.status(400).send("Job id required");
    }

    try{
        const job=await Job.findById(jobId).populate("category");

        if(!job){
            return res.status(400).send("Job not found");
        }

        res.status(200).json(job);

    }catch(err){
        res.send(err)
    }
}

exports.getSpecificJobClient=async(req,res)=>{
    const jobId=req.params.job;

    if(!jobId){
        return res.status(400).send("Job id required");
    }

    try{
        const job=await Job.findById(jobId);

        if(!job){
            return res.status(400).send("Job not found");
        }

        let clientPosts=[];

        let basicClientPosts=await Job.findById(jobId).populate({path:"clientPosts" , populate:{path:"creatorId"}});

        let socialClientPosts=await Job.findById(jobId).populate({path:"clientPosts" , populate:{path:"creatorSocialId"}});

        basicClientPosts.clientPosts.map((post,i)=>{
            if(post.creatorId!=null){
                clientPosts.push(post);
            }
        })

        socialClientPosts.clientPosts.map((post,i)=>{
            if(post.creatorSocialId!=null){
                clientPosts.push(post);
            }
        })

        res.status(200).json(clientPosts);

    }catch(err){
        res.send(err)
    }
}

exports.getSpecificJobFreelancer=async(req,res)=>{
    const jobId=req.params.job;

    if(!jobId){
        return res.status(400).send("Job id required");
    }

    try{
        const job=await Job.findById(jobId);

        if(!job){
            return res.status(400).send("Job not found");
        }

        let freelancerPosts=[];

        let basicFreelancerPosts=await Job.findById(jobId).populate({path:"freelancerPosts" , populate:{path:"creatorId"}});

        let socialFreelancerPosts=await Job.findById(jobId).populate({path:"freelancerPosts" , populate:{path:"creatorSocialId"}});

        basicFreelancerPosts.freelancerPosts.map((post,i)=>{
            if(post.creatorId!=null){
                freelancerPosts.push(post)
            }
        })

        socialFreelancerPosts.freelancerPosts.map((post,i)=>{
            if(post.creatorSocialId!=null){
                freelancerPosts.push(post)
            }
        })

        res.status(200).json(freelancerPosts)
    }catch(err){
        res.send(err)
    }
}

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({});

        res.status(200).json(jobs);
    } catch (err) {
        res.status(400).send(err);
    }
};
