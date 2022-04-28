const TaskList = require('../../models/task/taskListModel');
const Employee = require('../../models/employeeModel');
const Company = require('../../models/companyModel');


// @route   GET api/taskList/business
// @desc    Get all task lists for a company
// @access  Private
const getAllCompanyTaskLists = async (req, res) => {
    try {
        const company = await Company.findOne({ user: req.user._id }).populate('businesses');

        const taskLists = await TaskList.find({ company: company})
            .populate('business');
            
        return res.status(200).json(taskLists);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({msg: 'Server Error'});
    }
}


// @route   GET api/taskList/user
// @desc    Get all task lists for a user
// @access  Private
const getAllUserTaskLists = async (req, res) => {
    try {
        const userEmployee = await Employee.find({ user: req.user._id});

        if (!userEmployee) {
            return res.status(400).json({msg: 'No employee found'});
        }

        const taskLists = await TaskList.find({ 
            business: {
                $in: userEmployee.map(employee => employee.business)
            }
        })
        .populate('business');

        return res.status(200).json(taskLists);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({msg: 'Server Error'});
    }
}


// @route   POST api/taskList
// @desc    Create a task list
// @access  Private
const createTaskList = async (req, res) => {
    try {
        const { business, positions, name, frequency, color, taskItems } = req.body;
        const employee = await Employee.findOne({ user: req.user._id, business: business }).populate('company');

        if (!employee) {
            return res.status(400).json({msg: 'You are not an employee of this business'});
        }

        if(employee.isManager || employee.company.owners.includes(req.user._id)) {
            const taskList = await TaskList.create({
                business,
                positions,
                name,
                frequency,
                color,
                createdBy: req.user._id
            });

            const newTaskList = await taskList.save();

            return res.status(200).json(newTaskList);
        } else {
            return res.status(400).json({msg: 'You are not authorized to create a task list'});
        }

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({msg: 'Server Error'});
    }
}


// @route   PUT api/taskList/:id
// @desc    Update a task list
// @access  Private
const updateTaskList = async (req, res) => {
    try {
        const employee = await Employee.findOne({ user: req.user._id, business: req.body.business }).populate('company');

        if (!employee) {
            return res.status(400).json({msg: 'You are not an employee of this business'});
        }

        if(employee.isManager || employee.company.owners.includes(req.user._id)) {
            const taskList = await TaskList.findByIdAndUpdate(req.params.id, req.body, { new: true });

            return res.status(200).json(taskList);
        } else {
            return res.status(400).json({msg: 'You are not authorized to update a task list'});
        }

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({msg: 'Server Error'});
    }
}


// @route   DELETE api/taskList/:id
// @desc    Delete a task list
// @access  Private
const deleteTaskList = async (req, res) => {
    try {
        const employee = await Employee.findOne({ user: req.user._id, business: req.body.business }).populate('company');

        if (!employee) {
            return res.status(400).json({msg: 'You are not an employee of this business'});
        }

        if(employee.isManager || employee.company.owners.includes(req.user._id)) {
            const taskList = await TaskList.findById(req.params.id);

            if (!taskList) {
                return res.status(400).json({msg: 'Task list not found'});
            }

            await taskList.remove();

            return res.status(200).json({taskList, msg: 'Task list deleted'});
        } else {
            return res.status(400).json({msg: 'You are not authorized to delete a task list'});
        }

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({msg: 'Server Error'});
    }
}


module.exports = {
    getAllCompanyTaskLists,
    getAllUserTaskLists,
    createTaskList,
    updateTaskList,
    deleteTaskList
}