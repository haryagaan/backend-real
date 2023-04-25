const { Job } = require('../models/job.module');

const { JobCategory } = require('../models/jobCategory.module');

exports.createCategory = async (req, res) => {
    const { category } = req.body;

    try {
        if (!category) {
            return res.status(400).send('Category required');
        }

        const newCategory = await JobCategory.create({ category });

        await newCategory.save();

        res.status(200).json(newCategory);
    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.getSpecificCategory = async (req, res) => {
    const { category } = req.body;

    try {
        if (!category) {
            return res.status(400).send('Category required');
        }

        const existingCategory = await JobCategory.findOne({ category: category });

        if (!existingCategory) {
            return res.status(404).send('Couldnt find a category');
        }

        const populatedExistingCategory = await JobCategory.findOne({ category: category }).populate('jobs');

        res.status(200).json(populatedExistingCategory);
    } catch (err) {
        res.status(400).send(err);
    }
};
exports.getAllCategory = async (req, res) => {
    try {
        const existingCategory = await JobCategory.find({});

        res.status(200).json(existingCategory);
    } catch (err) {
        res.status(400).send(err);
    }
};
exports.deleteCategory = async (req, res) => {
    try {
        const { _id } = req.body;
        const del = await JobCategory.deleteOne({ _id: _id });
        res.send("deleted");
    } catch (err) {
        res.status(400).send(err);
    }
};
