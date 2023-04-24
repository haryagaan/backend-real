const {Job}=require("../models/job.module");

const {JobCategory}=require("../models/jobCategory.module");

exports.createJob=async(req,res)=>{
    const {
        name
    }=req.body;

    try{
        if(!name){
            return res.status(404).send("Job name is required");
        }

        const newJob=await Job.create({name});

        await newJob.save();

        res.send(newJob);

    }catch(err){
        res.status(400).send(err);
    }
}

exports.createJobAndPushToCategory=async(req,res)=>{
    const {
        name,
        category
    }=req.body;

    try{
        if(!name || !category){
            return res.status(404).send("Job or Category required");
        }

        const existingCategory=await JobCategory.findOne({category:category});

        if(!existingCategory){
            return res.status(404).send("Couldnt find a category");
        }

        const newJob=await Job.create({name});

        await newJob.save();

        existingCategory.jobs.push(newJob._id);

        await existingCategory.save();

        res.status(200).json(existingCategory);

    }catch(err){
        res.status(400).send(err);
    }
}

exports.getJobs=async(req,res)=>{
    try{
        const jobs=await Job.find({});

        res.status(200).json(jobs)
    }catch(err){
        res.status(400).send(err);
    }
}