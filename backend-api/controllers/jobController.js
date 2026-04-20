const Job = require('../models/Job');

exports.createJob = async (req, res) => {
    try {
        const { title, description, location, salary, type } = req.body;
        const newJob = new Job({
            employerId: req.user.id,
            title,
            description,
            location,
            salary,
            type
        });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.applyForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.applicants.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already applied' });
        }

        job.applicants.push(req.user.id);
        await job.save();
        res.json({ message: 'Application successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
