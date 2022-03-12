const db = require("../config/connection");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const path = require('path');

const userControllers = {

   register : async (req, res) => {
      try {
         const {firstname, lastname, email, password} = req.body;
         var dateTimeNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
         const passwordHash = await bcrypt.hash(password, 10);
         var sql = `INSERT INTO xx_users(firstname, lastname, email, password, created_date, updated_date)
                    VALUES("${firstname}", "${lastname}", "${email}", "${passwordHash}", "${dateTimeNow}", "${dateTimeNow}")`;

         db.query(sql, (err, result) => {

            if(err) return res.status(500).json({status : false , message : err.message});

            res.status(200).json({
               status : true,
               message : "Register Success"
            });
         });
      }catch(error) {
         return res.status(500).json({msg : error.message});
      }
   },

   login : async (req, res) => {
      try {
         const {email, password} = req.body;

         var sql = `SELECT * FROM xx_users WHERE email = "${email}"`;

         db.query(sql, (err, result) => {
            if(err) return res.status(500).json({status : false, message : "Server Error"});

            if(result.length == 0) return res.status(500).json({status : false, message : "Sorry Your Email not found"});

            bcrypt.compare(password, result[0]['password'])
            .then((isTrue) => {
               if(!isTrue) return res.status(500).json({status : false, message : "Your Password Wrong"});
               const token = jwt.sign({id : result[0]['id']}, "RAHASIA", {expiresIn : '1d'});
               return res.status(200).json({
                  status : true,
                  message : "Login Success",
                  user : {
                     email : result[0]['email'],
                     id : result[0]['id'],
                     firstname : result[0]['firstname'],
                     lastname : result[0]['lastname']
                  },
                  token : token
               });
            })
         });
         
      } catch (error) {
         return res.status(500).json({status : false ,message : error.message});
      }
   },

   createExperience : async (req, res) => {
      try {
         const {user_id, job_title, company, country, starting_month, starting_year, ending_month, currently_working_here, description} = req.body;
         var dateTimeNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
         var sql = `INSERT INTO xx_seeker_experience(user_id, job_title, company, country, starting_month, starting_year, ending_month, currently_working_here, description, updated_date)
                     VALUES("${user_id}", "${job_title}", "${company}", "${country}", "${starting_month}", "${starting_year}", "${ending_month}", "${currently_working_here}", "${description}", "${dateTimeNow}")`;

         db.query(sql, (err, result) => {
            if(err) return res.status(500).json({status : false , message : err.message});

            res.status(200).json({
               status : true,
               message : "Update Experience Success"
            });
         });
      } catch (error) {
         return res.status(500).json({status : false ,message : error.message});
      }
   },

   createEducation : async (req, res) => {
      try {
         const {user_id, degree, degree_title, major_subjects, country, city, institution, completion_year, result_type} = req.body;
         var dateTimeNow = new Date().toISOString().slice(0, 19).replace('T', ' ');

         var sql = `INSERT INTO xx_seeker_education(user_id, degree, degree_title, major_subjects, country, city, institution, completion_year, result_type, updated_date)
                     VALUES("${user_id}", "${degree}", "${degree_title}", "${major_subjects}", "${country}", "${city}", "${institution}", "${completion_year}", "", "${dateTimeNow}")`;

         db.query(sql, (err, result) => {
            if(err) return res.status(500).json({status : false , message : err.message});

            res.status(200).json({
               status : true,
               message : "Update Education Success"
            });
         });
      
      } catch (error) {
         return res.status(500).json({status : false ,message : error.message});
      }
   },

   createLanguage : async (req, res) => {
      try {
         const {user_id, language, proficiency} = req.body;
         var dateTimeNow = new Date().toISOString().slice(0, 19).replace('T', ' ');

         var sql = `INSERT INTO xx_seeker_languages(user_id, language, proficiency, updated_date)
                     VALUES("${user_id}", "${language}", "${proficiency}", "${dateTimeNow}")`;

         db.query(sql, (err, result) => {
            if(err) return res.status(500).json({status : false , message : err.message});

            res.status(200).json({
               status : true,
               message : "Update Languages Success"
            });
         });
      
      } catch (error) {
         return res.status(500).json({status : false ,message : error.message});
      }
   },

   updateUser : async (req, res) => {
      try {
         // const {profile_picture} = req.file.path;
         // const {id} = req.body;
         const {id, firstname, lastname, email, mobile_no, dob, age, category, job_title, skills, current_salary, expected_salary, nationality, country, state, address} = req.body;
         var sql = `SELECT * FROM xx_users WHERE id = "${id}"`;
         var dateTimeNow = new Date().toISOString().slice(0, 19).replace('T', ' ');

         db.query(sql, (err, result) => {
            if(err) return res.status(500).json({status : false , message : err.message});
            console.log(result[0]['profile_picture'])

            if(req.file == undefined){
               var sql = `UPDATE xx_users SET firstname="${firstname}", lastname="${lastname}", email="${email}", mobile_no="${mobile_no}", dob="${dob}",
                        age="${age}", category="${category}", job_title="${job_title}", skills="${skills}", current_salary="${current_salary}",
                        expected_salary="${expected_salary}", nationality="${nationality}", country="${country}", state="${state}", address="${address}", 
                        created_date="${dateTimeNow}", updated_date="${dateTimeNow}" WHERE id="${id}"`;
               db.query(sql, (err, result) => {
                  if(err) return res.status(500).json({status : false , message : err.message});

                  res.status(200).json({
                     status : true,
                     message : "Update User Success"
                  });
               });
            } else {
               fs.unlink(path.join(`${result[0]['profile_picture']}`));
               var sql = `UPDATE xx_users SET profile_picture="${req.file.destination}/${req.file.filename}",
                        firstname="${firstname}", lastname="${lastname}", email="${email}", mobile_no="${mobile_no}", dob="${dob}",
                        age="${age}", category="${category}", job_title="${job_title}", skills="${skills}", current_salary="${current_salary}",
                        expected_salary="${expected_salary}", nationality="${nationality}", country="${country}", state="${state}", address="${address}", 
                        created_date="${dateTimeNow}", updated_date="${dateTimeNow}" WHERE id="${id}"`;
               db.query(sql, (err, result) => {
                  if(err) return res.status(500).json({status : false , message : err.message});
                  res.status(200).json({
                     status : true,
                     message : "Update User Success"
                  });
               });
            }
         });



         // if(req.file == undefined){
         //    var dateTimeNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
         //    const {id, firstname, lastname, email, mobile_no, dob, age, category, job_title, skills, current_salary, expected_salary, nationality, country, state, address} = req.body;
         //    var sql = `UPDATE xx_users SET firstname="${firstname}", lastname="${lastname}", email="${email}", mobile_no="${mobile_no}", dob="${dob}",
         //             age="${age}", category="${category}", job_title="${job_title}", skills="${skills}", current_salary="${current_salary}",
         //             expected_salary="${expected_salary}", nationality="${nationality}", country="${country}", state="${state}", address="${address}", 
         //             created_date="${dateTimeNow}", updated_date="${dateTimeNow}" WHERE id="${id}"`;
         //    db.query(sql, (err, result) => {
         //       if(err) return res.status(500).json({status : false , message : err.message});

         //       res.status(200).json({
         //          status : true,
         //          message : "Update User Success"
         //       });
         //    });
         // } else {
         //    await fs.unlink(path.join(`uploads/${bank.imageUrl}`));
         // }


         // var dateTimeNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
         // const {id, firstname, lastname, email, mobile_no, dob, age, category, job_title, skills, current_salary, expected_salary, nationality, country, state, address} = req.body;
         // var sql = `UPDATE xx_users SET profile_picture="${req.file.destination}/${req.file.filename}",
         //           firstname="${firstname}", lastname="${lastname}", email="${email}", mobile_no="${mobile_no}", dob="${dob}",
         //           age="${age}", category="${category}", job_title="${job_title}", skills="${skills}", current_salary="${current_salary}",
         //           expected_salary="${expected_salary}", nationality="${nationality}", country="${country}", state="${state}", address="${address}", 
         //           created_date="${dateTimeNow}", updated_date="${dateTimeNow}" WHERE id="${id}"`;
         // db.query(sql, (err, result) => {
         //    if(err) return res.status(500).json({status : false , message : err.message});

         //    res.status(200).json({
         //       status : true,
         //       message : "Update User Success"
         //    });
         // });
         // console.log(email);
      } catch (error) {
         return res.status(500).json({status : false ,message : error.message});
      }
   }
}

module.exports = userControllers;