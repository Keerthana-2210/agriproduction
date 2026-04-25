const Job = require('../models/Job');
const User = require('../models/User');

exports.createJob = async (req, res) => {
    try {
        const { title, description, location, salary, type, contact } = req.body;
        const newJob = new Job({
            employerId: req.user.id,
            title,
            description,
            location,
            salary,
            type,
            contact
        });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        
        // Populate applicants with user details (name, phone)
        const populatedJobs = await Promise.all(jobs.map(async (job) => {
            const applicantDetails = await Promise.all(
                (job.applicants || []).map(async (id) => {
                    const user = await User.findById(id);
                    return user ? { _id: user._id, name: user.name, phone: user.phone, email: user.email } : id;
                })
            );
            return { ...job, applicants: applicantDetails };
        }));

        // Sort natively by createdAt descending
        populatedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(populatedJobs);
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

exports.editJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.employerId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this job' });
        }

        const { title, description, location, salary, type, contact } = req.body;
        if (title) job.title = title;
        if (description) job.description = description;
        if (location) job.location = location;
        if (salary) job.salary = salary;
        if (type) job.type = type;
        if (contact) job.contact = contact;

        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
