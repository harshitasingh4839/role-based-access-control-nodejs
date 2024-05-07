const router = require('express').Router();
const User = require('../models/user.model');
const mongoose = require('mongoose');
const { roles } = require('../utils/constants');

router.get('/users',async (req,res,next)=>{
    try {
        const users = await User.find();
        res.render('manage_users',{users})
    } catch (error) {
        next(error);
    }
});

router.get('/user/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash('error', 'Invalid ID');
            return res.redirect('/admin/users');
        }
        
        // Assuming `User` is your Mongoose model
        const person = await User.findById(id);
        
        // If no user found, redirect with error
        if (!person) {
            req.flash('error', 'User not found');
            return res.redirect('/admin/users');
        }

        // Render the profile page with the found user
        res.render('profile', { person });
    } catch (error) {
        next(error); // Pass any caught errors to the error handler middleware
    }
});

router.post('/update-role', async (req, res, next) => {
    try {
      const { id, role } = req.body;
  
      // Checking for id and roles in req.body
      if (!id || !role) {
        req.flash('error', 'Invalid request');
        return res.redirect('back');
      }
  
      // Check for valid mongoose objectID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid id');
        return res.redirect('back');
      }
  
      // Check for Valid role
      const rolesArray = Object.values(roles);
      if (!rolesArray.includes(role)) {
        req.flash('error', 'Invalid role');
        return res.redirect('back');
      }
  
      // Admin cannot remove himself/herself as an admin
      if (req.user.id === id) {
        req.flash(
          'error',
          'Admins cannot remove themselves from Admin, ask another admin.'
        );
        return res.redirect('back');
      }
  
      // Finally update the user
      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      );
  
      req.flash('info', `updated role for ${user.email} to ${user.role}`);
      res.redirect('back');
    } catch (error) {
      next(error);
    }
  });

module.exports = router