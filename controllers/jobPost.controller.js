const { JobPost } = require('../models/jobPost.module');

const { Job } = require('../models/job.module');

const { JobCategory } = require('../models/jobCategory.module');

const { User } = require('../models/user.module');

const { UserSocial } = require('../models/user-social.module');

exports.createPost = async (req, res) => {
    const { title, mainText, price } = req.body;

    const id = req.params.id;

    const job = req.params.job;

    const category = req.params.category;

    let creatorType;

    let creatorRating;

    try {
        if (!title || !mainText || !price || !id || !job || !category) {
            return res.status(400).send('Insufficient requests');
        }

        //user

        const existingUser = await User.findById(id);

        const existingUserSocial = await UserSocial.findById(id);

        if (!existingUser && !existingUserSocial) {
            return res.status(404).send('No user found');
        } else {
            if (existingUser) {
                creatorRating = existingUser.rating;
                creatorType = 'basic';
            } else {
                creatorRating = existingUserSocial.rating;
                creatorType = 'social';
            }
        }

        //job

        const existingJob = await Job.findById(job);

        if (!existingJob) {
            return res.status(404).send('Job not found');
        }

        //category

        const existingCategory = await JobCategory.findById(category);

        if (!existingCategory) {
            return res.status(404).send('Category not found');
        }

        const hourlyPrice = price + 'MNT' + '/h';

        const newPost = await JobPost.create({
            title,
            mainText,
            price: hourlyPrice,
            job,
            category,
            creatorId: id,
            creatorIdSocial: id,
            creatorType,
            creatorRating,
        });

        existingJob.posts.push(newPost._id);

        await existingJob.save();

        res.status(200).json(newPost);
    } catch (err) {
        res.send(err);
    }
};

exports.deletePost = async (req, res) => {
    const id = req.params.id;

    const postId = req.params.post;

    try {
        if (!id || !postId) {
            return res.status(400).send("Id's required");
        }

        const existingUser = await User.findById(id);

        const existingUserSocial = await UserSocial.findById(id);

        if (!existingUser && !existingUserSocial) {
            return res.status(404).send('No user found');
        }

        const existingPost = await JobPost.findById(postId);

        if (!existingPost) {
            return res.status(404).send('No post found');
        }

        if(id==existingPost.creatorId && id==existingPost.creatorIdSocial){
            const del=await JobPost.findByIdAndDelete(postId);

            res.status(200).send("Post deleted by its creator");
        }else{
            if(existingUser && existingUser.role.admin==process.env.ADMIN){
                const del=await JobPost.findByIdAndDelete(postId);

                res.status(200).send("Post deleted by admin basic");
            }else if(existingUserSocial && existingUserSocial.role.admin==process.env.ADMIN){
                const del=await JobPost.findByIdAndDelete(postId);

                res.status(200).send("Post deleted by admin social");
            }
        }


    } catch (err) {
        res.send(err);
    }
};
