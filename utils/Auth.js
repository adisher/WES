const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const Booklet = require("../models/Booklet");
const Audio = require("../models/Audio");
const Course = require("../models/Course");
const Company = require("../models/Company");
const Webinar = require("../models/Webinar");
const Countries = require("../models/Countries");
const Quiz = require("../models/Quiz");
const { SECRET } = require("../config");
const axios = require('axios');
const util = require('util');
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const path = require('path');
const { writeFileSync, readFileSync } = require("fs");
const { getAudioDurationInSeconds } = require('get-audio-duration');
const nodeMailer = require('nodemailer')


// retrieve and return all users/ retrive and return a single user
const find = async (req, role, res)=>{
  console.log("query: ", req.query)
  console.log("role: ", role)
  const sess_email = req.query.session
    console.log("sess_email", sess_email)

  if(req.query.id && sess_email){
      const id = req.query.id;
      console.log("role if ID && email: ", role)
      await User.find({email: sess_email}).populate({
        path: 'enrolled_users',
        select:
          '_id',
        }).exec().then(data =>{
              if(!data){
                  res.status(404).send({ message : "Not found user with id "+ id})
              }else{
                console.log(util.inspect(data[0].enrolled_users, {showHidden: false, depth: null, colors: true}))
                const userID = data[0].enrolled_users;

                User.find({ '_id': { $in: userID } }).populate({
                  path: 'enrolled_courses',
                  select:
                    'course_title course_description course_price course_credit course_module_title course_video_title course_video course_audio course_booklet',
                  }).exec().then(data => {
                  if(!data){
                    res.status(404).send({ message : "Not found user"})
                  }else{
                    console.log("enrolled_users[]: ", util.inspect(data, {showHidden: false, depth: null, colors: true}))
                    console.log(util.inspect(data[0].enrolled_courses, {showHidden: false, depth: null, colors: true}))
                    res.send(data)
                  }
              })
              }
          })
          .catch(err =>{
              res.status(500).send({ message: "Erro retrieving user with id " + id})
          })

  }else if(req.query.id){
    const id = req.query.id;
      console.log("role if ID: ", role)
      await User.findById(id).populate({
        path: 'enrolled_courses',
        select:
          'course_title course_description course_price course_credit course_module_title createdAt course_video_title course_video course_audio course_booklet',
        }).exec().then(data =>{
              if(!data){
                  res.status(404).send({ message : "Not found user with id "+ id})
              }else{
                  res.send(data)
              }
          })
          .catch(err =>{
              res.status(500).send({ message: "Erro retrieving user with id " + id})
          })
  }else if(req.query.id && role == 'user'){
    const id = req.query.id;
      console.log("role if ID: ", role)
      await User.findById(id).then(data =>{
              if(!data){
                  res.status(404).send({ message : "Not found user with id "+ id})
              }else{
                  res.send(data)
              }
          })
          .catch(err =>{
              res.status(500).send({ message: "Erro retrieving user with id " + id})
          })
  }else if(req.query.id && role == 'company'){
    const id = req.query.id;
      console.log("role if ID: ", role)
      await User.findById(id).then(data =>{
              if(!data){
                  res.status(404).send({ message : "Not found user with id "+ id})
              }else{
                  res.send(data)
              }
          })
          .catch(err =>{
              res.status(500).send({ message: "Erro retrieving user with id " + id})
          })
  }else if(role == 'user'  && sess_email){  
    await User.find({ email: sess_email }).populate({
      path: 'enrolled_users',
      select:
        '_id',
      }).exec().then(data => {
      if(!data){
        res.status(404).send({ message : "Not found user"})
      }else{
        // const jsonData = JSON.stringify(data.enrolled_users)
        // console.log("company User: ", data);
        console.log(util.inspect(data[0].enrolled_users, {showHidden: false, depth: null, colors: true}))
        const userID = data[0].enrolled_users;
        User.find({ '_id': { $in: userID } }).then(data => {
            if(!data){
              res.status(404).send({ message : "Not found user"})
            }else{
              res.send(data)
            }
        })
      }
    })
    .catch(err =>{
        res.status(500).send({ message: "Erro retrieving user"})
    })
  }else if(role == 'user'){  
    await User.find({ role: 'user' }).populate({
      path: 'enrolled_courses',
      select:
        'course_title course_description course_price course_credit enrolled_user course_module_title course_video_title course_video course_audio course_booklet',
      }).exec().then(data => {
      if(!data){
        res.status(404).send({ message : "Not found user"})
      }else{
        res.send(data)
      }
    })
    .catch(err =>{
        res.status(500).send({ message: "Erro retrieving user"})
    })
  }else if(role == 'company' && sess_email) {
    await User.find({ email: sess_email }).populate({
      path: 'enrolled_courses',
      select:
        'course_title course_description course_price course_credit createdAt enrolled_user course_module_title course_video_title course_video course_audio course_booklet',
      }).exec().then(data => {
      if(!data){
        res.status(404).send({ message : "Not found user"})
      }else{
        console.log("res-Json: ", data);
          res.send(data)
      }
    })
    .catch(err =>{
        res.status(500).send({ message: "Erro retrieving user"})
    })
  }else if(role == 'company'){
      await User.find({ role: role }).populate({
        path: 'enrolled_courses',
        select:
          'course_title course_description course_price course_credit enrolled_user course_module_title course_video_title course_video course_audio course_booklet',
        }).exec().then(data => {
        if(!data){
          res.status(404).send({ message : "Not found user"})
        }else{
          console.log("company_courses: ", data);
            res.send(data)
        }
      })
      .catch(err =>{
          res.status(500).send({ message: "Erro retrieving user"})
      })
  }else if(role == 'superadmin'){
    await User.find({ email: sess_email })
    .then(data => {
      if(!data){
        res.status(404).send({ message : "Not found user"})
      }else{
        console.log("company_courses: ", data);
          res.send(data)
      }
    })
    .catch(err =>{
        res.status(500).send({ message: "Erro retrieving user"})
    })
} else{
    await User.find().then(data =>{
      if(!data){
        res.status(404).send({ message : "Not found user"})
      }else{
        console.log("res-Json: ", data);
          res.send(data)
      }
    })
    .catch(err =>{
        res.status(500).send({ message: "Erro retrieving user"})
    })
  }

  
}

/**
 * @DESC Perform delete operations
 */
 const deleteInfo = async (req, table, role, res) => {
  try {
    console.log("req.query: ", req.query);
    if(table == 'webinar'){
      
          Webinar.findByIdAndDelete(req.query.WebinarID).then(data => {
            if (!data) {
              res.status(404).json({
                message: `Webinar not found.`,
                success: false
            })}else{

              res.redirect('/webinars');
            }
          }).catch((error) => {
              res.status(500).send(error);
          })

    }else if(table == 'audio'){
      console.log("audio deleted")
      Audio.findByIdAndDelete(req.query.audioID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Audio not found.`,
            success: false
        })}else{

          res.redirect('/audios');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'booklet'){
      console.log("booklet deleted")
      Booklet.findByIdAndDelete(req.query.bookletID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Booklet not found.`,
            success: false
        })}else{

          res.redirect('/booklets');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'course'){
      console.log("course deleted")
      Course.findByIdAndDelete(req.query.courseID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Course not found.`,
            success: false
        })}else{

          res.redirect('/courses');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'company'){
      console.log("company deleted")
      User.findByIdAndDelete(req.query.companyID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Company not found.`,
            success: false
        })}else{

          res.redirect('/company');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'user'){
      console.log("user deleted")
      User.findByIdAndDelete(req.query.userID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `User not found.`,
            success: false
        })}else{

          res.redirect('/users');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'companyUser'){
      console.log("user deleted")
      User.findByIdAndDelete(req.query.companyUserID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `User not found.`,
            success: false
        })}else{

          res.redirect('/company_users');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }
    else if(table == 'remove'){
      console.log("course removed")
      await User.findById(req.query.companyID).populate({
        path: 'enrolled_courses',
        select:
          '_id',
        }).exec().then(data => {
        if(!data){
          res.status(404).send({ message : "Not found user"})
        }else{
          // const jsonData = JSON.stringify(data.enrolled_users)
          // console.log("company User: ", data);
          console.log(util.inspect(data.enrolled_courses, {showHidden: false, depth: null, colors: true}))
          const userID = data.enrolled_courses;
          User.findOneAndUpdate({ 'enrolled_courses': { $in: userID } }, { $pull: {'enrolled_courses': req.query.removeCourseID } }).then(data => {
              if(!data){
                res.status(404).send({ message : "Not found user"})
              }else{
                console.log(util.inspect(data, {showHidden: false, depth: null, colors: true}))
                res.redirect('/company');
              }
          })
        }
      })
      .catch(err =>{
          res.status(500).send({ message: "Erro retrieving user"})
      })
    }

    
  } catch (err) {
    // Implement logger function (winston)
    console.log(err)
    return res.status(500).json({
      message: "Unable to find.",
      success: false,
    });
  }
};

/**
 * @DESC Perform suspend operations
 */
 const suspendInfo = async (req, table, role, res) => {
  try {
    console.log("req.query: ", req.query);
    if(table == 'webinar'){

          Webinar.findByIdAndUpdate(req.query.webinarID, {status: 'suspend'}, { useFindAndModify: false })
          .then(data => {
            if (!data) {
              res.status(404).json({
                message: `Webinar not found.`,
                success: false
            })}else{

              res.redirect('/webinars');
            }
          }).catch((error) => {
              res.status(500).send(error);
          })

    }else if(table == 'audio'){
      console.log("audio deleted")
      Audio.findByIdAndDelete(req.query.audioID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Audio not found.`,
            success: false
        })}else{

          res.redirect('/audios');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'booklet'){
      console.log("booklet deleted")
      Booklet.findByIdAndDelete(req.query.bookletID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Booklet not found.`,
            success: false
        })}else{

          res.redirect('/booklets');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'course'){
      console.log("course suspend")
      Course.findByIdAndUpdate(req.query.courseID, {status: 'suspend'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `Course not found.`,
            success: false
        })}else{

          res.redirect('/courses');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'company'){
      console.log("company deleted")
      User.findByIdAndUpdate(req.query.companyID, {status: 'suspend'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `Company not found.`,
            success: false
        })}else{

          res.redirect('/company');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'user'){
      console.log("user updated")
      User.findByIdAndUpdate(req.query.userID, {status: 'suspend'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `User not found.`,
            success: false
        })}else{

          res.redirect('/users');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }
    else if(table == 'companyUser'){
      console.log("user updated")
      User.findByIdAndUpdate(req.query.companyUserID, {status: 'suspend'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `User not found.`,
            success: false
        })}else{

          res.redirect('/company_users');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }
    else if(table == 'remove'){
      console.log("course removed")
      await User.findById(req.query.companyID).populate({
        path: 'enrolled_courses',
        select:
          '_id',
        }).exec().then(data => {
        if(!data){
          res.status(404).send({ message : "Not found user"})
        }else{
          // const jsonData = JSON.stringify(data.enrolled_users)
          // console.log("company User: ", data);
          console.log(util.inspect(data.enrolled_courses, {showHidden: false, depth: null, colors: true}))
          const userID = data.enrolled_courses;
          User.findOneAndUpdate({ 'enrolled_courses': { $in: userID } }, { $pull: {'enrolled_courses': req.query.removeCourseID } }).then(data => {
              if(!data){
                res.status(404).send({ message : "Not found user"})
              }else{
                console.log(util.inspect(data, {showHidden: false, depth: null, colors: true}))
                res.redirect('/company');
              }
          })
        }
      })
      .catch(err =>{
          res.status(500).send({ message: "Erro retrieving user"})
      })
    }

    
  } catch (err) {
    // Implement logger function (winston)
    console.log(err)
    return res.status(500).json({
      message: "Unable to find.",
      success: false,
    });
  }
};

/**
 * @DESC Perform active operations
 */
 const activeInfo = async (req, table, role, res) => {
  try {
    console.log("req.query: ", req.query);
    if(table == 'webinar'){

          Webinar.findByIdAndUpdate(req.query.webinarID, {status: 'active'}, { useFindAndModify: false })
          .then(data => {
            if (!data) {
              res.status(404).json({
                message: `Webinar not found.`,
                success: false
            })}else{

              res.redirect('/webinars');
            }
          }).catch((error) => {
              res.status(500).send(error);
          })

    }else if(table == 'audio'){
      console.log("audio deleted")
      Audio.findByIdAndDelete(req.query.audioID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Audio not found.`,
            success: false
        })}else{

          res.redirect('/audios');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'booklet'){
      console.log("booklet deleted")
      Booklet.findByIdAndDelete(req.query.bookletID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Booklet not found.`,
            success: false
        })}else{

          res.redirect('/booklets');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'course'){
      console.log("course deleted")
      Course.findByIdAndUpdate(req.query.courseID, {status: 'active'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `Course not found.`,
            success: false
        })}else{

          res.redirect('/courses');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'company'){
      console.log("company deleted")
      User.findByIdAndUpdate(req.query.companyID, {status: 'active'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `Company not found.`,
            success: false
        })}else{

          res.redirect('/company');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'user'){
      console.log("user active")
      User.findByIdAndUpdate(req.query.userID, {status: 'active'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `User not found.`,
            success: false
        })}else{

          res.redirect('/users');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'companyUser'){
      console.log("user updated")
      User.findByIdAndUpdate(req.query.companyUserID, {status: 'active'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `User not found.`,
            success: false
        })}else{

          res.redirect('/company_users');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }
    else if(table == 'remove'){
      console.log("course removed")
      await User.findById(req.query.companyID).populate({
        path: 'enrolled_courses',
        select:
          '_id',
        }).exec().then(data => {
        if(!data){
          res.status(404).send({ message : "Not found user"})
        }else{
          // const jsonData = JSON.stringify(data.enrolled_users)
          // console.log("company User: ", data);
          console.log(util.inspect(data.enrolled_courses, {showHidden: false, depth: null, colors: true}))
          const userID = data.enrolled_courses;
          User.findOneAndUpdate({ 'enrolled_courses': { $in: userID } }, { $pull: {'enrolled_courses': req.query.removeCourseID } }).then(data => {
              if(!data){
                res.status(404).send({ message : "Not found user"})
              }else{
                console.log(util.inspect(data, {showHidden: false, depth: null, colors: true}))
                res.redirect('/company');
              }
          })
        }
      })
      .catch(err =>{
          res.status(500).send({ message: "Erro retrieving user"})
      })
    }

    
  } catch (err) {
    // Implement logger function (winston)
    console.log(err)
    return res.status(500).json({
      message: "Unable to find.",
      success: false,
    });
  }
};

/**
 * @DESC Perform block operations
 */
 const blockInfo = async (req, table, role, res) => {
  try {
    console.log("req.query: ", req.query);
    if(table == 'webinar'){

          Webinar.findByIdAndUpdate(req.query.webinarID, {status: 'block'}, { useFindAndModify: false })
          .then(data => {
            if (!data) {
              res.status(404).json({
                message: `Webinar not found.`,
                success: false
            })}else{

              res.redirect('/webinars');
            }
          }).catch((error) => {
              res.status(500).send(error);
          })

    }else if(table == 'audio'){
      console.log("audio deleted")
      Audio.findByIdAndDelete(req.query.audioID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Audio not found.`,
            success: false
        })}else{

          res.redirect('/audios');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'booklet'){
      console.log("booklet deleted")
      Booklet.findByIdAndDelete(req.query.bookletID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Booklet not found.`,
            success: false
        })}else{

          res.redirect('/booklets');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'course'){
      console.log("course deleted")
      Course.findByIdAndUpdate(req.query.courseID, {status: 'block'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `Course not found.`,
            success: false
        })}else{

          res.redirect('/courses');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'company'){
      console.log("company deleted")
      User.findByIdAndUpdate(req.query.companyID, {status: 'block'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `Company not found.`,
            success: false
        })}else{

          res.redirect('/company');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'user'){
      console.log("user blocked")
      User.findByIdAndUpdate(req.query.userID, {status: 'block'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `User not found.`,
            success: false
        })}else{

          res.redirect('/users');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'companyUser'){
      console.log("user updated")
      User.findByIdAndUpdate(req.query.companyUserID, {status: 'block'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `User not found.`,
            success: false
        })}else{

          res.redirect('/company_users');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }
    else if(table == 'remove'){
      console.log("course removed")
      await User.findById(req.query.companyID).populate({
        path: 'enrolled_courses',
        select:
          '_id',
        }).exec().then(data => {
        if(!data){
          res.status(404).send({ message : "Not found user"})
        }else{
          // const jsonData = JSON.stringify(data.enrolled_users)
          // console.log("company User: ", data);
          console.log(util.inspect(data.enrolled_courses, {showHidden: false, depth: null, colors: true}))
          const userID = data.enrolled_courses;
          User.findOneAndUpdate({ 'enrolled_courses': { $in: userID } }, { $pull: {'enrolled_courses': req.query.removeCourseID } }).then(data => {
              if(!data){
                res.status(404).send({ message : "Not found user"})
              }else{
                console.log(util.inspect(data, {showHidden: false, depth: null, colors: true}))
                res.redirect('/company');
              }
          })
        }
      })
      .catch(err =>{
          res.status(500).send({ message: "Erro retrieving user"})
      })
    }

    
  } catch (err) {
    // Implement logger function (winston)
    console.log(err)
    return res.status(500).json({
      message: "Unable to find.",
      success: false,
    });
  }
};

/**
 * @DESC Perform unblock operations
 */
 const unblockInfo = async (req, table, role, res) => {
  try {
    console.log("req.query: ", req.query);
    if(table == 'webinar'){

          Webinar.findByIdAndUpdate(req.query.webinarID, {status: 'active'}, { useFindAndModify: false })
          .then(data => {
            if (!data) {
              res.status(404).json({
                message: `Webinar not found.`,
                success: false
            })}else{

              res.redirect('/webinars');
            }
          }).catch((error) => {
              res.status(500).send(error);
          })

    }else if(table == 'audio'){
      console.log("audio deleted")
      Audio.findByIdAndDelete(req.query.audioID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Audio not found.`,
            success: false
        })}else{

          res.redirect('/audios');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'booklet'){
      console.log("booklet deleted")
      Booklet.findByIdAndDelete(req.query.bookletID).then(data => {
        if (!data) {
          res.status(404).json({
            message: `Booklet not found.`,
            success: false
        })}else{

          res.redirect('/booklets');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'course'){
      console.log("course deleted")
      Course.findByIdAndUpdate(req.query.courseID, {status: 'active'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `Course not found.`,
            success: false
        })}else{

          res.redirect('/courses');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'company'){
      console.log("company deleted")
      User.findByIdAndUpdate(req.query.companyID, {status: 'active'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `Company not found.`,
            success: false
        })}else{

          res.redirect('/company');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'user'){
      console.log("user unblocked")
      User.findByIdAndUpdate(req.query.userID, {status: 'active'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `User not found.`,
            success: false
        })}else{

          res.redirect('/users');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }else if(table == 'companyUser'){
      console.log("user updated")
      User.findByIdAndUpdate(req.query.companyUserID, {status: 'active'}, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `User not found.`,
            success: false
        })}else{

          res.redirect('/company_users');
        }
      }).catch((error) => {
          res.status(500).send(error);
      })
    }
    else if(table == 'remove'){
      console.log("course removed")
      await User.findById(req.query.companyID).populate({
        path: 'enrolled_courses',
        select:
          '_id',
        }).exec().then(data => {
        if(!data){
          res.status(404).send({ message : "Not found user"})
        }else{
          // const jsonData = JSON.stringify(data.enrolled_users)
          // console.log("company User: ", data);
          console.log(util.inspect(data.enrolled_courses, {showHidden: false, depth: null, colors: true}))
          const userID = data.enrolled_courses;
          User.findOneAndUpdate({ 'enrolled_courses': { $in: userID } }, { $pull: {'enrolled_courses': req.query.removeCourseID } }).then(data => {
              if(!data){
                res.status(404).send({ message : "Not found user"})
              }else{
                console.log(util.inspect(data, {showHidden: false, depth: null, colors: true}))
                res.redirect('/company');
              }
          })
        }
      })
      .catch(err =>{
          res.status(500).send({ message: "Erro retrieving user"})
      })
    }

    
  } catch (err) {
    // Implement logger function (winston)
    console.log(err)
    return res.status(500).json({
      message: "Unable to find.",
      success: false,
    });
  }
};

/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */
const userRegister = async (userDets, req, role, res) => {
  try {
    let {name, email, username, pass, interest, learn, tos, newsletter } = userDets;
    if (name == '' || email == '' || username == '' || pass == '' || interest == '' || learn == '' || tos == '' || newsletter == '' ) {
      // res.status(400).send({ message: "Data to update can not be empty" })
      req.flash('blank', 'Field cannot be empty');
      res.redirect("/signup");
      return;
    }
    console.log("superAdmin: ", role);
    // Validate the username
    let usernameNotTaken = await validateUsername(userDets.username);
    if (!usernameNotTaken) {
      req.flash('failed', 'Username is already taken');
        res.redirect("/signup");
        return;
    }

    // validate the email
    let emailNotRegistered = await validateEmail(userDets.email);
    if (!emailNotRegistered) {
      req.flash('failed', 'Email is already registered');
        res.redirect("/signup");
        return;
    }

    // Get the hashed password

    // console.log("user: ", userDets.username);
    // console.log("name: ", userDets.name);
    // console.log("email: ", userDets.email);
    // console.log("pass: ", userDets.password);
    let password = await bcrypt.hash(userDets.pass, 12)

    // create a new user
    const newUser = await new User({
      ...userDets,
      password,
      role
    });

    await newUser.save()
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `User Not Added` })
      } else {
        // res.status(200).send({
        //   message: `Password is now set.`,
        //   data
        // })
        req.flash('success', 'Registered Succesfully');
        res.redirect("/signup");
      }
    })
    // return res.status(201).json({
    //   message: "Registered Successfully",
    //   success: true
    // });
  } catch (err) {
    // Implement logger function (winston)
    console.log(err)
    return res.status(500).json({
      message: "Unable to create your account.",
      success: false,
    });
  }
};

/**
 * @DESC To Login the user (ADMIN, SUPER_ADMIN, USER)
 */
const userLogin = async (userCreds, res) => {
  console.log("login: ", userCreds.body);
  let { email, password } = userCreds.body;
  // First Check if the username is in the database
  if (password == '' || email == '') {
    // res.status(400).send({ message: "Data to update can not be empty" })
    userCreds.flash('blank', 'Field cannot be empty');
    res.redirect("/login");
  }
  
  await User.findOne({email}).then(data => {
    // console.log("res.locals", user)
    userCreds.session.userID = data._id;
    userCreds.session.email = data.email;
    userCreds.session.name = data.name;
    console.log("session.userID", userCreds.session.userID)
    console.log("session.email", userCreds.session.email)
    console.log("session.name", userCreds.session.name)
    console.log("user: ", data);
    if (!data.email) {
      userCreds.flash('failed', 'Please enter valid Email and Password');
      res.redirect("/login");
    }
    
    // Now check for the password
    bcrypt.compare(password, data.password, function (err, result) {
      console.log('bcryptResult: ', result)
      console.log('bcryptErr: ', err)
      if (err) throw err
      if (result != true) {
        // userCreds.flash('failed', 'Please enter valid Email and Password');
        res.redirect("/login");
      }
      else {
        // Sign in the token and issue it to the user
        let token = jwt.sign(
          {
            user_id: data._id,
            role: data.role,
            username: data.username,
            email: data.email
          },
          SECRET,
          { expiresIn: "7 days" }
        );
    
        let result = {
          username: data.username,
          role: data.role,
          email: data.email,
          token: `Bearer ${token}`,
          expiresIn: 30000
        };
    
        if(data.role == 'company'){
          
            Company.findOne({ email }).then((company)=> {

              console.log("company: ", company);
              userCreds.flash('company', company );
              return res.redirect('/company_dashboard');
            })
    
        }
        else if(data.role == 'user'){
            console.log("user");
            // userCreds.flash('company', company );
            return res.redirect('/home');
        }
        else {

          return res.redirect('/dashboard');
        }
        // return res.status(200).json({
        //   ...result,
        //   message: "Hurray! You are now logged in.",
        //   success: true
        // });
      }
    });
  })
  
  // const user = await User.findOne({ email });
};

const setPassword = async (userDets, role, res) => {

  // console.log("length: ", Object.values(userDets.body))
  let { password, cpassword } = userDets.body;
  if (password == '' || cpassword == '') {
    // res.status(400).send({ message: "Data to update can not be empty" })
    if(role == 'superadmin'){
      userDets.flash('blank', 'Field cannot be empty');
      res.redirect("/setAdminPassword");
    } else if(role == 'user'){
      userDets.flash('blank', 'Field cannot be empty');
      res.redirect("/setUserPassword");
    }
  }
  const id = userDets.params.id;

  console.log('userPass: ', password)
  const passHash = await bcrypt.hash(password, 12);
  //converting key value pair for password
  var jsonPass = {};
  var key = "password";
  jsonPass[key] = passHash;
  // console.log('hashPass: ', jsonPass)

  User.findByIdAndUpdate(id, jsonPass, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
      } else {
        // res.status(200).send({
        //   message: `Password is now set.`,
        //   data
        // })
        
        userDets.flash('success', 'Password set, please login!');
        res.redirect("/login");
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error Update user information" })
    })
}

const changePassword = async (userDets, role, res) => {

  console.log("userDets: ", userDets.body)
  let { currentPass, password, cpassword } = userDets.body;
  if ( currentPass == '' || password == '' || cpassword == '') {
    // res.status(400).send({ message: "Data to update can not be empty" })
    if(role == 'company'){
      userDets.flash('blank', 'Field cannot be empty');
      res.redirect("/changeCompanyPassword");
      return;

    }else if(role == 'superadmin'){
      userDets.flash('blank', 'Field cannot be empty');
      res.redirect("/changePassword");
      return;

    }else if(role == 'user') {
      userDets.flash('blank', 'Field cannot be empty');
      res.redirect("/changeUserPassword");
      return;
    }
  }
  const id = userDets.params.id;

  if(userDets.body){
    
    await User.findById(id)
          .then(data =>{
            console.log("dbPass: ", data.password);
              if(!data){
                  // res.status(404).send({ message : "Not found user with id "+ id})
                  if(res.status(404)){
                    
                    if(role == 'company'){
                      userDets.flash('failed', 'No User Found!');
                      res.redirect("/changeCompanyPassword");
                      return;

                    }else if(role == 'superadmin'){
                      userDets.flash('failed', 'No User Found!');
                      res.redirect("/changePassword");
                      return;

                    }else if(role == 'user') {
                      userDets.flash('failed', 'No User Found!');
                      res.redirect("/changeUserPassword");
                      return;
                    }
                  }
              } else{
                bcrypt.compare(currentPass, data.password, function (err, result) {
                  console.log('bcryptResult: ', result)
                  console.log('bcryptErr: ', err)
                  if (err) throw err

                      if (result != true) {
                        
                        if(role == 'company'){
                          userDets.flash('failed', 'Current Password is not correct!');
                          res.redirect("/changeCompanyPassword");
                          return;
                        }else if(role == 'superadmin'){
                          userDets.flash('failed', 'Current Password is not correct!');
                          res.redirect("/changePassword");
                          return;
                        }else if(role == 'user'){
                          userDets.flash('failed', 'Current Password is not correct!');
                          res.redirect("/changeUserPassword");
                          return;
                        }
                        
                      }else
                      // console.log("password: ", password)
                      if(password != cpassword){
                        
                        if(role == 'company'){
                          userDets.flash('failed', 'Passwords do not match!');
                          res.redirect("/changeCompanyPassword");
                          return;
                        }else if(role == 'superadmin'){
                          userDets.flash('failed', 'Passwords do not match!');
                          res.redirect("/changePassword");
                          return;
                        }else if(role == 'user'){
                          userDets.flash('failed', 'Current Password is not correct!');
                          res.redirect("/changeUserPassword");
                          return;
                        }
                       
                      }
                    });
                    
                  
              }
          })
          .catch(err =>{
            res.status(500).send({ message: "Error retrieving user with id"});
            return;
          })
  }

  const passHash = await bcrypt.hash(password, 12);
  //converting key value pair for password
  var jsonPass = {};
  var key = "password";
  jsonPass[key] = passHash;

  User.findByIdAndUpdate(id, jsonPass, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
      } else {
        // res.status(200).send({
        //   message: `Password is now set.`,
        //   data
        // })
        
        userDets.flash('success', 'Password is now changed, please login!');
        res.redirect("/login");
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error Update user information", err })
    })
}

const updateProfile = async (userDets, role, res) => {

  console.log("userDets: ", userDets.body)
  let { name, email, location, phone } = userDets.body;
  if ( name == '' || email == '' || location == '' || phone == '') {
    // res.status(400).send({ message: "Data to update can not be empty" })
    if(role == 'superadmin'){
      userDets.flash('blank', 'Field cannot be empty');
      res.redirect("/editProfile");
    } else if(role == 'company'){
      userDets.flash('blank', 'Field cannot be empty');
      res.redirect("/editCompanyProfile");
    } else if(role == 'user'){
      userDets.flash('blank', 'Field cannot be empty');
      res.redirect("/editUserProfile");
    }
  }
  const id = userDets.params.id;

    User.findByIdAndUpdate(id, userDets.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
        } else {
          // res.status(200).send({
          //   message: `Password is now set.`,
          //   data
          // })
          if(role == 'superadmin'){
            userDets.flash('success', 'Profile Updated!');
            res.redirect("/profile");
          } else if(role == 'company'){
            userDets.flash('success', 'Profile Updated!');
            res.redirect("/company_profile");
          } else if(role == 'user'){
            userDets.flash('success', 'Profile Updated!');
            res.redirect("/user_profile");
          }
          
        }
      })
      .catch(err => {
        res.status(500).send({ message: "Error Update user information", err })
      })
};

const findBooklet = (req, role, res)=>{

  if(req.query.id){
      const id = req.query.id;

      Booklet.findById(id)
          .then(data =>{
              if(!data){
                  res.status(404).send({ message : "No Booklet Found"})
              }else{
                  res.send(data)
              }
          })
          .catch(err =>{
              res.status(500).send({ message: "Erro retrieving booklet"})
          })

  }else{
    Booklet.find()
          .then(booklet => {
              res.send(booklet)
          })
          .catch(err => {
              res.status(500).send({ message : err.message || "Error Occurred while retriving booklet information" })
          })
  }

  
}

const addBooklet = async (userDets, role, res) => {

  // console.log("length: ", Object.values(userDets.body))
  let { title } = userDets.body;
  let { thumbnail, pdf } = userDets.files;
  if (title == '' || thumbnail == '' || pdf == '' ) {
    // res.status(400).send({ message: "Data to update can not be empty" })
    userDets.flash('blank', 'Field cannot be empty');
    res.redirect("/add_booklet");
    return;
  }
  const id = userDets.params.id;

  console.log('userDets: ', userDets)

  // name of the input is thumbnail
  let nameThumbnail = thumbnail[0].filename;

  // name of the input is pdf
  let namePDF = pdf[0].filename

  console.log('filePDF: ', namePDF);
  console.log('fileThumbnail: ', nameThumbnail);


  const newBooklet = new Booklet({
    title: title,
    thumbnail: nameThumbnail,
    pdf: namePDF
  });
  console.log('newBooklet', newBooklet)

  await newBooklet.save()
  // Booklet.findByIdAndUpdate(id, title, file.name, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Booklet Not Added` })
      } else {
        // res.status(200).send({
        //   message: `Password is now set.`,
        //   data
        // })
        
        userDets.flash('success', 'Booklet Added!');
        res.redirect("/booklets");
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error Adding Booklet: ", err })
    })
}

const findWebinar = (req, category, res)=>{

  if(req.query.id){
      const id = req.query.id;

      Webinar.findById(id)
          .then(data =>{
              if(!data){
                  res.status(404).send({ message : "No Webinar Found"})
              }else{
                  res.send(data)
              }
          })
          .catch(err =>{
              res.status(500).send({ message: "Erro retrieving Webinar"})
          })

  }else if(category == 'Live Now'){
    Webinar.find({category: 'Live Now'})
          .then(webinar => {
            console.log("webinar else")
              res.send(webinar)
          })
          .catch(err => {
              res.status(500).send({ message : err.message || "Error Occurred while retriving Webinar information" })
          })
  }else if(category == 'user'){
    const webinarJSON = []
    Webinar.find({category: 'Live Now'})
          .then(live => {
            console.log("live else")
            webinarJSON.push({live})
            Webinar.find({category: 'Pre-Recorded'})
            .then(recorded => {
              console.log("recorded else")
              webinarJSON.push({recorded})
              Webinar.find({category: 'Upcoming'})
              .then(upcoming => {
                console.log("upcoming else")
                webinarJSON.push({upcoming})
                  res.send(webinarJSON)
              })
              .catch(err => {
                  res.status(500).send({ message : err.message || "Error Occurred while retriving Webinar information" })
              })
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving Webinar information" })
            })
          })
          .catch(err => {
              res.status(500).send({ message : err.message || "Error Occurred while retriving Webinar information" })
          })
  }else {
    Webinar.find()
          .then(webinar => {
            console.log("webinar else")
              res.send(webinar)
          })
          .catch(err => {
              res.status(500).send({ message : err.message || "Error Occurred while retriving Webinar information" })
          })
  }

  
}

const addWebinar = async (userDets, role, res) => {

  // console.log("length: ", Object.values(userDets.body))
  let { title, category, date, time, link } = userDets.body;
  if (title == '' || category == '' || date == '' || time == '' || link == '' ) {
    // res.status(400).send({ message: "Data to update can not be empty" })
    userDets.flash('blank', 'Field cannot be empty');
    res.redirect("/add_webinar");
    return;
  }

  const newWebinar = new Webinar({
    title: title,
    category: category,
    date: date,
    time: time,
    link: link,
    status: 'active'
  });
  console.log('newWebinar', newWebinar)

  await newWebinar.save()
  // Booklet.findByIdAndUpdate(id, title, file.name, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Webinar Not Added` })
      } else {
        // res.status(200).send({
        //   message: `Password is now set.`,
        //   data
        // })
        
        userDets.flash('success', 'Webinar Added!');
        res.redirect("/webinars");
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error Adding Webinar: ", err })
    })
}

const findAudio = (req, role, res)=>{

  if(req.query.id){
      const id = req.query.id;

      Audio.findById(id)
          .then(data =>{
              if(!data){
                  res.status(404).send({ message : "No Audio Found"})
              }else{
                  res.send(data)
              }
          })
          .catch(err =>{
              res.status(500).send({ message: "Erro retrieving Audio"})
          })

  }else{
    Audio.find()
          .then(audio => {
              res.send(audio)
          })
          .catch(err => {
              res.status(500).send({ message : err.message || "Error Occurred while retriving Audio information" })
          })
  }

  
}

const addAudio = async (userDets, role, res) => {

  // console.log("length: ", Object.values(userDets.body))
  let { title } = userDets.body;
  let { audio } = userDets.files;
  var totalSeconds = 0;
  if (title == '' || audio == '' ) {
    // res.status(400).send({ message: "Data to update can not be empty" })
    userDets.flash('blank', 'Field cannot be empty');
    res.redirect("/add_audio");
    return;
  }
  const id = userDets.params.id;

  // name of the input is audio
  let nameAudio = audio[0].filename;

  getAudioDurationInSeconds(`uploads/${nameAudio}`).then((duration) => {
    console.log("duration: ", duration)
    totalSeconds = duration;
    // get number of full minutes
    const minutes = Math.floor(totalSeconds / 60);
    console.log('minutes: ', minutes);


    // get remainder of seconds
    const seconds = Math.floor(totalSeconds % 60);
    console.log('seconds: ', seconds);


    function padTo2Digits(num) {
      return num.toString().padStart(2, '0');
    }

    // ✅ format as MM:SS
    const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
    console.log('result: ', result); // "09:25"

    const newAudio = new Audio({
      title: title,
      audio: nameAudio,
      duration: result
    });
    console.log('newAudio', newAudio)

    newAudio.save()
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Audio Not Added` })
      } else {
        // res.status(200).send({
        //   message: `Password is now set.`,
        //   data
        // })
        
        userDets.flash('success', 'Audio Added!');
        res.redirect("/audios");
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error Adding Audio: ", err })
    })
  })

  
}

const findCourses = (req, role, res)=>{

  console.log("findCourses")
  console.log("query: ", req.query.id)
  console.log("params: ", req.params.id)
  // console.log("body: ", req)
  if(req.query.id){
      const id = req.query.id;
      console.log("findById")

      Course.findById(id)
          .then(data =>{
            
              if(!data){
                  res.status(404).send({ message : "No Course Found"})
              }else{
                console.log("findByIdElse: ", data)
                  res.send(data)
              }
          })
          .catch(err =>{
              res.status(500).send({ message: "Erro retrieving Course"})
          })

  }else{
    console.log("find")
    Course.find()
          .then(course => {
              res.send(course)
          })
          .catch(err => {
              res.status(500).send({ message : err.message || "Error Occurred while retriving Course information" })
          })
  }

  
}

const addCourse = async (userDets, role, res) => {

  // console.log("length: ", Object.values(userDets.body))
  let { title, price, discount, description, audio, booklet, crhrs } = userDets.body;
  if (title == '' || price == '' || discount == '' || description == '' || crhrs == '' ) {
    // res.status(400).send({ message: "Data to update can not be empty" })
    userDets.flash('blank', 'Field cannot be empty');
    res.redirect("/add_course");
    return;
  }
  const id = userDets.params.id;

  // console.log('userDets: ', userDets)

  const newCourse = new Course({
    course_title: title,
    course_description: description,
    course_price: price,
    course_credit: crhrs,
    course_discount: discount,
    course_audio: audio,
    course_booklet: booklet,
    enrolled_user: '1',
    status: 'active'
  });
  console.log('newCourse', newCourse)

  await newCourse.save()
    .then(data => {
      console.log('data', data)
      console.log('data[0]', data._id)
      var courseJSON = JSON.stringify(data)
      console.log('courseJSON[0]', courseJSON);
      if (!data) {
        res.status(404).send({ message: `Course Not Added` })
      } else {
        // res.status(200).send({
        //   message: `Password is now set.`,
        //   data
        // })
        lastCourseID = data._id;
        userDets.flash('proceed', 'Course Added, Please Add Your Course Videos Now!');
        userDets.flash('courseID', lastCourseID );
        res.redirect("/add_course");
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error Adding Course: ", err })
    })
}

const addCourseVideo = async (userDets, role, res) => {

  // console.log("length: ", Object.values(userDets.body))
  let { moduleTitle, videoTitle, courseID } = userDets.body;
  let { video } = userDets.files;
  if (moduleTitle == '' || videoTitle == '' || video == '' ) {
    // res.status(400).send({ message: "Data to update can not be empty" })
    userDets.flash('blank', 'Field cannot be empty');
    res.redirect("/add_course");
    return;
  }
  // const id = userDets.params.id;

  console.log('userDets: ', userDets)
  console.log('courseID: ', courseID)

  // name of the input is audio
  let nameVideo = video[0].filename;

  console.log('nameVideo: ', nameVideo);

  let jsonData = {
    course_module_title: moduleTitle,
    course_video_title: videoTitle,
    course_video: nameVideo
  };


  Course.findByIdAndUpdate(courseID, jsonData, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot Update course with ${id}. Maybe course not found!` })
      } else {
        // res.status(200).send({
        //   message: `Password is now set.`,
        //   data
        // })
        
        userDets.flash('success', 'Course Updated!');
        res.redirect("/courses");
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error Update course video", err })
    })
}

const findCompany = (req, role, res)=>{

  console.log("findCompany")
  console.log("query: ", req.query.id)
  console.log("params: ", req.params.id)
  if(req.query.id){
      const id = req.query.id;
      console.log("findById")
      
      Company.findById(id).populate({
        path: 'enrolled_courses',
        select:
          'course_title course_description course_price course_credit course_module_title course_video_title course_video course_audio course_booklet company',
        })
          .then(data =>{
            
              if(!data){
                  res.status(404).send({ message : "No Company Found"})
              }else{
                console.log("findByIdElse: ", data)
                  res.send(data)
              }
          })
          .catch(err =>{
              res.status(500).send({ message: "Erro retrieving Company"})
          })

  }else{
    console.log("find")
    User.find().populate({
      path: 'enrolled_courses',
      select:
        'course_title course_description course_price course_credit course_module_title course_video_title course_video course_audio course_booklet',
      }).then(course => {
            console.log("compCourse: ", course)
              res.send(course)
          })
          .catch(err => {
              res.status(500).send({ message : err.message || "Error Occurred while retriving Company information" })
          })
  }
  
}

const addCompany = async (userDets, role, res) => {

  // console.log("length: ", Object.values(userDets.body))
  let { name, email, company, location, course } = userDets.body;
  if (name == '' || email == '' || company == '' || location == '' || course == '' ) {
    // res.status(400).send({ message: "Data to update can not be empty" })
    userDets.flash('blank', 'Field cannot be empty');
    res.redirect("/add_company");
    return;
  }
  // validate the email
  let emailNotRegistered = await validateEmail(email);
  if (!emailNotRegistered) {
    userDets.flash('failed', 'Email is already registered');
    res.redirect("/add_company");
  }
  const id = userDets.params.id;

  // console.log('userDets: ', userDets)

  // const newCompany = new Company({
  //   _id: new mongoose.Types.ObjectId(),
  //   name: name,
  //   email: email,
  //   company_name: company,
  //   location: location,
  //   status: 'active',
  //   courses: course
  // });
  // console.log('newCompany', newCompany)
  let password = await bcrypt.hash('12345', 12)

  const newCompanyUser = new User({
    name: name,
    email: email,
    location: location,
    company_name: company,
    status: 'active',
    enrolled_courses: course,
    phone: '1234567',
    password: password,
    role: role
  });
  console.log('newCompanyUser', newCompanyUser);


  await newCompanyUser.save()
  // await newCompany.save()

    .then(data => {
      console.log('data', data)
      console.log('data[0]', data._id)
      var courseJSON = JSON.stringify(data)
      console.log('courseJSON[0]', courseJSON);
      if (!data) {
        res.status(404).send({ message: `newCompany Not Added` })
      } else {
        // res.status(200).send({
        //   message: `Password is now set.`,
        //   data
        // })

        let mailOptions = {
          from: 'adilsher973@gmail.com',
          to: email,
          subject: 'Welcome to WES',
          html: `<p>Click <a href="https://x3node.herokuapp.com/setCompanyPassword?id=${data._id}" target="_blank">here</a> to Set Password</p>`
      
        }
  
        console.log(mailOptions)
  
        let transport  = nodeMailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'adilsher973@gmail.com',
            pass: 'nwybuqdcvgtsqjmv'
          },
          tls: {
            rejectUnauthorized: false
          }
          
          
        });
  
  
        transport.sendMail(mailOptions, (err) =>{
          if(err){
            res.status(404).send(err)
          }else{
            userDets.flash('success', `Company Added, User will now set password details sent at ${email}`);
            res.redirect("/company");
          }
  
        })

      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error Adding Company: ", err })
    })
}

const updateCompany = async (userDets, role, res) => {

  // console.log("length: ", Object.values(userDets.body))
  let { name, email, company, location, course } = userDets.body;
  if (name == '' || email == '' || company == '' || location == '' || course == '' ) {
    // res.status(400).send({ message: "Data to update can not be empty" })
    userDets.flash('blank', 'Field cannot be empty');
    res.redirect("/edit_company");
    return;
  }
  const id = userDets.params.id;

  console.log('id: ', id)
  console.log('course: ', course)



  await User.findById(id).populate({
    path: 'enrolled_courses',
    select:
      '_id',
    }).exec().then(data =>{
          if(!data){
              res.status(404).send({ message : "Not found user with id "+ id})
          }else{
            console.log(util.inspect(data.enrolled_courses, {showHidden: false, depth: null, colors: true}))
            const userID = data.enrolled_courses;

            User.find({id,  'enrolled_courses': { $in: userID } }).exec().then(data => {
              if(!data){
                res.status(404).send({ message : "Not found user"})
              }else{
                // console.log("enrolled_users[]: ", util.inspect(data, {showHidden: false, depth: null, colors: true}))
                console.log(util.inspect(data, {showHidden: false, depth: null, colors: true}))
                let jsonData = {
                  name: name,
                  email: email,
                  company_name: company,
                  location: location,
                };
              
              
                User.findByIdAndUpdate(id, jsonData, { useFindAndModify: false })
                  .then(data => {
                    if (!data) {
                      res.status(404).send({ message: `Cannot Update company with ${id}. Maybe company not found!` })
                    } else {
                      // res.status(200).send({
                      //   message: `Password is now set.`,
                      //   data
                      // })
                      User.findByIdAndUpdate(id, { '$push': { 'enrolled_courses': course } }, { useFindAndModify: false })
                      .then(data => {
                        if (!data) {
                          res.status(404).send({ message: `Cannot Update company with ${id}. Maybe company not found!` })
                        } else {

                        userDets.flash('success', 'Company Updated!');
                        res.redirect("/company");
                        }
                      })
                      
                    }
                  })
                  .catch(err => {
                    res.status(500).send({ message: "Error Update company", err })
                  })
              }
          })
          }
      })
      .catch(err =>{
          res.status(500).send({ message: "Erro retrieving user with id " + id})
      })

}

const checkout = async (userDets, role, res) => {

  console.log("userDets: ", userDets.body)
  
  let { name, number, expiry, cvc, item, price, enrolled_courses, company_id } = userDets.body;
  console.log('userCourseID: ', enrolled_courses);
  console.log('company_id: ', company_id);
  if ( enrolled_courses == '' || company_id == '') {
    // res.status(400).send({ message: "Data to update can not be empty" })
    userDets.flash('blank', 'Field cannot be empty');
    res.redirect("/checkout");
    return;
  }

  const course = enrolled_courses;
  const company = company_id;
  const id = userDets.params.id;
console.log("userDets.params.id", userDets.params.id)
  await User.findByIdAndUpdate(id, { '$push': { 'enrolled_courses': course } }, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
      } else{

        User.findByIdAndUpdate(company, {'$push': { 'enrolled_users': id } }, { useFindAndModify: false })
        .then(data =>{
          if (!data) {
            res.status(404).send({ message: `Cannot Update user with ${company}. Maybe user not found!` })
          } else {
            // res.status(200).send({
            //   message: `Password is now set.`,
            //   data
            // })
            Course.findByIdAndUpdate({enrolled_user }).exec().then(data => {
              if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${company}. Maybe user not found!` })
              } else{

                console.log("enrolled_courses: ", data)

                userDets.flash('success', 'Profile Updated!');
                res.redirect("/userDashboard");
                
              }
            })
            
            
          }
        })
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error Update user information", err })
    })
};

const addQuiz = async (req, role, res)=>{
  const userID = req.query.userID;
  const courseID = req.query.courseID;
  console.log("courseID-quiz: ", courseID)
  console.log("userID-quiz: ", userID)

  
  // public API
  await axios.get('https://the-trivia-api.com/api/questions?categories=science,general_knowledge&limit=5&difficulty=easy')
  .then(quiz =>{
          if(!quiz.data){
            res.status(404).send({ message : "No Quiz Found"})
          }else{

            console.log("quiz: ", quiz.data);
            let questions = quiz.data.map(({ question }) => question)
            let correctAnswer = quiz.data.map(({ correctAnswer }) => correctAnswer)
            let incorrectAnswers = quiz.data.map(({ incorrectAnswers }) => incorrectAnswers)
            
            console.log("questions: ", questions);
            console.log("correctAnswers: ", correctAnswer);
            console.log("incorrectAnswers: ", incorrectAnswers);
            // create a new user
            const newQuiz = new Quiz({
              question: questions,
              correct: correctAnswer,
              wrong: incorrectAnswers,
              courses: courseID,
              users: userID
            });

            newQuiz.save()
            .then(data => {
              console.log("after data: ", data)
              res.send(data)
            })
          }
        })
      .catch(err =>{
          res.status(500).send({ message: "Erro retrieving Quiz"})
      })
  
}
var check;
const findQuiz = async (req, role, res)=>{
  const userID = req.query.userID;
  const courseID = req.query.courseID;
  console.log("courseID-quiz: ", courseID)
  console.log("userID-quiz: ", userID)
  check = 0;

  
  // Fetch questions
  Quiz.find({courses: courseID}).exec().then(quiz => {
    if(!quiz){
      res.status(404).send({ message : "No Quiz Found"})
    }else{
      res.send(quiz)
    }
  })
  .catch(err => {
    res.status(500).send({ message: "Error finding Quiz", err })
  })
  
}

const getCountries = async (req, role, res)=>{

  
  // Fetch questions
  Countries.find().then(country => {
    if(!country){
      res.status(404).send({ message : "No Countries Found"})
    }else{
      res.send(country)
    }
  })
  .catch(err => {
    res.status(500).send({ message: "Error finding country", err })
  })
  
}

const checkQuiz = async (req, role, res)=>{
  console.log("req.query | checkQuiz: ", req.query)
  const userID = req.query.id;
  const count = req.query.count;
  const courseID = req.query.courseID;
  const correct = req.query.correct;
  if(count > 5){
    check = 0;
  }
  
  
  console.log("correct: ", correct)
  console.log("checkInitial: ", check)
  
  // Fetch questions
  Quiz.find({courses: courseID}).exec().then(quiz => {
    if(!quiz){
      res.status(404).send({ message : "No Quiz Found"})
    }else{
      console.log("quiz: ", quiz[0])
      let correctAnswer = quiz.map(({ correct }) => correct);
      console.log("correctAnswer: ", correctAnswer)
      console.log("correctAnswerLength: ", correctAnswer[0].length)


      if(correctAnswer[0].includes(correct)){
        check++;
        console.log("check++: ", check);
      }
            
      console.log("check: ", check);
      quiz.push({check});
      console.log("checkQUIZ: ", quiz);

      res.send(quiz)
    }
  })
  .catch(err => {
    res.status(500).send({ message: "Error finding Quiz", err })
  })
  
}

const certificate = async (req, role, res) => {
  console.log("req.query: ", req.query)

  const sess_name = req.query.name
  const document = await PDFDocument.load(readFileSync("E:/X3 Technologies/Xyron/One1000Project/assets/images/certificate.pdf"));

  const courierBoldFont = await document.embedFont(StandardFonts.Courier);
  const firstPage = document.getPage(0);

  firstPage.moveTo(72, 570);
  firstPage.drawText(new Date().toUTCString(), {
    font: courierBoldFont,
    size: 12,
  });

  firstPage.moveTo(105, 530);
  firstPage.drawText("Ms. Jane,", {
    font: courierBoldFont,
    size: 12,
  });

  writeFileSync("E:/X3 Technologies/Xyron/One1000Project/assets/images/certificate"+sess_name+".pdf", await document.save())
  
  
}

const forgotPassword = async (req, role, res) => {
  console.log("req.query: ", req.body)

  let {email} = req.body;
  if ( email == '') {
    // res.status(400).send({ message: "Data to update can not be empty" })
    req.flash('blank', 'Field cannot be empty');
    res.redirect("/forgotPassword");
    return;
  }

  var otp = Math.floor(Math.random()*90000) + 10000;

  console.log(otp)

  await User.findOne({email: email})
  .then(data => {
    if(!data){
      res.status(404).send({ message : "No User Found"})
    }else{

      console.log("data: ", data._id)
      const id = data._id
      console.log("id: ", id)
      User.findByIdAndUpdate(id, {otp: otp}, { useFindAndModify: false })
      .then(data => {
        if(!data){
          res.status(404).send({ message : "No User Found"})
        }else{

          console.log('data after otp update: ', data)
  
          let mailOptions = {
            from: 'adilsher973@gmail.com',
            to: email,
            subject: 'OTP | WES',
            html: `<p>Your OTP is ${otp}. Click <a href="https://x3node.herokuapp.com/otp?id=${id}" target="_blank">here</a> to proceed</p>`
        
          }
    
          console.log(mailOptions)
    
          let transport  = nodeMailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'adilsher973@gmail.com',
              pass: 'nwybuqdcvgtsqjmv'
            },
            tls: {
              rejectUnauthorized: false
            }
            
            
          });
    
    
          transport.sendMail(mailOptions, (err) =>{
            if(err){
              res.status(404).send(err)
            }else{
              req.flash('success', `OTP sent at ${email}, please check your email address` )
              res.redirect('/otp');
            }
    
          })
        }
        
      })


    }

  })
  .catch(err => {
    console.log('errrr')
    res.status(500).send({ message: "Error finding User", err })
  })

  
}

const verifyOTP = async (req, role, res) => {
  console.log("req.body: ", req.body)
  console.log("req.params: ", req.params)

  let {id} = req.params;
  let {num} = req.body;
  if ( num == '') {
    // res.status(400).send({ message: "Data to update can not be empty" })
    req.flash('blank', 'Field cannot be empty');
    res.redirect("/otp");
    return;
  }


  console.log('id:' , id)
  console.log('num:' , num)
  const stringOTP = num.toString();
  const filteredOTP = stringOTP.replace(/,/g, "")
  console.log('stringOTP:' , stringOTP)

  await User.findById(id)
  .then(data => {
    if(!data){
      res.status(404).send({ message : "No User Found"})
    }else{

      console.log("data: ", data._id)
      const otp = data.otp
      console.log("id: ", id)
      console.log("otp: ", otp)


      if(otp.match(filteredOTP)){
        req.flash("success", "Set your new password")
        res.redirect(`/setUserPassword?id=${id}`)
      }else {
        req.flash("failed", "OTP verification failed, try again!")
        res.redirect('/forgotPassword')
      }


    }

  })
  .catch(err => {
    console.log('errrr')
    res.status(500).send({ message: "Error finding User", err })
  })

  
}

const validateUsername = async username => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

/**
 * @DESC Passport middleware
 */
const userAuth = passport.authenticate("jwt", { session: false });

/**
 * @DESC Check Role Middleware
 */
const checkRole = roles => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();

const validateEmail = async email => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const serializeUser = user => {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    _id: user._id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt
  };
};

module.exports = {
  deleteInfo,
  suspendInfo,
  activeInfo,
  blockInfo,
  unblockInfo,
  find,
  userAuth,
  checkRole,
  userLogin,
  userRegister,
  setPassword,
  changePassword,
  updateProfile,
  addBooklet,
  findBooklet,
  findWebinar,
  addWebinar,
  addAudio,
  findAudio,
  findCourses,
  addCourse,
  addCourseVideo,
  findCompany,
  addCompany,
  updateCompany,
  checkout,
  addQuiz,
  findQuiz,
  checkQuiz,
  certificate,
  forgotPassword,
  verifyOTP,
  serializeUser,
  getCountries
};