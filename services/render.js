const axios = require('axios');

const parameters = process.env.PORT ? process.env.PORT: '5000';
const {
    generateClientToken
  } = require('../paypal.js');

  const { CLIENT_ID } = require("../config");

exports.paypal = async (req, res) => {
    const clientId = CLIENT_ID;
    const clientToken = await generateClientToken();
    res.render('test', { clientId, clientToken })
}

exports.setAdminPassRoute = async (req, res) => {
        const session = 'adilsher973@gmail.com' 
        axios.get('http://localhost:'+parameters+'/api/find',{ params : { session }})
        .then(function(userdata){
              console.log('id: ', userdata.data[0]._id)
              const blank = req.flash('blank')
              res.render('index', { user: userdata.data[0]._id, blank})
          })
          .catch(err =>{
              res.send(err);
          })
};

exports.setCompanyPassRoute = async (req, res) => { 
        axios.get('http://localhost:'+parameters+'/api/find',{ params : { id: req.query.id, role: 'company' }})
        .then(function(userdata){
              console.log('id: ', userdata.data._id)
              const success = req.flash('success')
            const failed = req.flash('failed')
            const blank = req.flash('blank')
              res.render('index', { user: userdata.data._id, blank, success, failed})
          })
          .catch(err =>{
              res.send(err);
          })
};

exports.setUserPassRoute = async (req, res) => {
        axios.get('http://localhost:'+parameters+'/api/find',{ params : { id : req.query.id, role: 'user' } })
        .then(function(userdata){
            console.log('id: ', userdata.data._id)
            const success = req.flash('success')
            const failed = req.flash('failed')
            const blank = req.flash('blank')
            res.render('newPassword', { user: userdata.data._id, success, failed, blank})
          })
          .catch(err =>{
              res.send(err);
          })
};

exports.loginRoute = async (req, res) => {
    const success = req.flash('success')
    const failed = req.flash('failed')
    const blank = req.flash('blank')
    res.render('login', {success, failed, blank})
};

exports.forgotPasswordRoute = async (req, res) => {
    const success = req.flash('success')
    const failed = req.flash('failed')
    const blank = req.flash('blank')
    res.render('forgotPassword', {success, failed, blank})
};

exports.otpRoute = async (req, res) => {
    const success = req.flash('success')
    const failed = req.flash('failed')
    const blank = req.flash('blank')
    const id = req.query.id
    res.render('otp', {success, failed, id, blank})
};

exports.dashboardRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/enrolled',{ params : { id : req.query.id }})
        .then(function(users){
              console.log('users: ', users.data)
              const message = req.flash('success')

              const enrolled_courses = users.data.map(({ enrolled_courses }) => enrolled_courses)
              console.log('enrolled_courses: ', enrolled_courses)

            const total_enrolled_courses = enrolled_courses.length
            
            console.log('total_enrolled_courses: ', total_enrolled_courses);
            axios.get('http://localhost:'+parameters+'/api/webinars',{ params : { category : 'Live Now' }})
            .then(webinar =>{
                const webinars = webinar.data.length
                axios.get('http://localhost:'+parameters+'/api/courses')
                .then(course => {
                    const courses = course.data
                    res.render('dashboard', {total_enrolled_courses, webinars, courses})
                })
            })
            .catch(err =>{
                res.send(err);
            }) 

          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.userSignupRoute = async (req, res) => {
    const success = req.flash('success')
    const failed = req.flash('failed')
    const blank = req.flash('blank')
    axios.get('http://localhost:'+parameters+'/api/countries')
        .then(function(users){
              console.log('users: ', users.data[0].Name)

              const countries = users.data;


              res.render('user_signup', {success, failed, countries, blank})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.companyDashboardRoute = async (req, res) => {
    const sess_email = req.session.email
        console.log("session_email", sess_email)

        axios.get('http://localhost:'+parameters+'/api/company_enrolled',{ params : { id : req.query.id, session: sess_email }})
        .then(function(users){
              console.log('users: ', users.data)
              const message = req.flash('success')

              const enrolled_users = users.data[0].enrolled_users
              const enrolled_courses = users.data[0].enrolled_courses
              console.log('length: ', enrolled_users.length);
              console.log('length: ', enrolled_courses.length);


              res.render('company_dashboard', { users : users.data, students: enrolled_users.length, courses: enrolled_courses.length, message, sess_email})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.companyUsersRoute = async (req, res) => {
    const sess_email = req.session.email
    console.log("session_emailUSER", sess_email)
    axios.get('http://localhost:'+parameters+'/api/enrolled',{ params : { id : req.query.id, session: sess_email}})
        .then(function(users){
              console.log('users: ', users.data)
              const message = req.flash('success')

              const enrolled_courses = users.data.enrolled_courses
              console.log('enrolled_courses: ', enrolled_courses);


              res.render('company_users', { users : users.data, message, sess_email})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.viewCompanyUsersRoute = async (req, res) => {
    const sess_email = req.session.email
    console.log("session_emailVIEW", sess_email)
    axios.get('http://localhost:'+parameters+'/api/company_enrolled',{ params : { id : req.query.id }})
        .then(function(users){
              console.log('users[0]: ', users.data)
              const message = req.flash('success')

              res.render('view_student', { user : users.data, message, sess_email})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.addStudentRoute = async (req, res) => {
    const companyFlash = req.flash('company');
    req.session.company = companyFlash;
    axios.get('http://localhost:'+parameters+'/api/find',{ params : { id : req.query.id }})
        .then(function(userdata){
              console.log('id: ', userdata.data[0]._id)
              const blank = req.flash('blank')
              res.render('add_student', { user : userdata.data[0]._id, blank})
          })
          .catch(err =>{
              res.send(err);
          }) 
};


exports.companyCoursesRoute = async (req, res) => {
    const sess_email = req.session.email
    console.log("session_emailCompany", sess_email)
    axios.get('http://localhost:'+parameters+'/api/company_enrolled',{ params : { id : req.query.id, session: sess_email }})
        .then(function(users){
              console.log('users: ', users.data)
              const message = req.flash('success')

              res.render('company_courses', { users : users.data[0], message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};


exports.adminProfileRoute = async (req, res) => {
    const sess_email = req.session.email
    axios.get('http://localhost:'+parameters+'/api/find',{ params : { id : req.query.id, session: sess_email }})
        .then(function(userdata){
              console.log('id: ', userdata.data)
              res.render('adminProfile', { user : userdata.data})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.companyProfileRoute = async (req, res) => {
    const sess_email = req.session.email
    axios.get('http://localhost:'+parameters+'/api/find',{ params : { id : req.query.id, session: sess_email }})
        .then(function(userdata){
              console.log('id: ', userdata.data)
              res.render('companyProfile', { user : userdata.data})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.userProfileRoute = async (req, res) => {
    const sess_email = req.session.email
    axios.get('http://localhost:'+parameters+'/api/find',{ params : { id : req.query.id, session: sess_email }})
        .then(function(userdata){
              console.log('id: ', userdata.data)
              res.render('userProfile', { user : userdata.data})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.editProfileRoute = async (req, res) => {
    const sess_email = req.session.email
    axios.get('http://localhost:'+parameters+'/api/find',{ params : { id : req.query.id, session: sess_email }})
        .then(function(userdata){
              console.log('id: ', userdata.data)
              const blank = req.flash('blank')
              res.render('editAdminProfile', { user : userdata.data, blank})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.editCompanyProfileRoute = async (req, res) => {
    const sess_email = req.session.email
    axios.get('http://localhost:'+parameters+'/api/find',{ params : { id : req.query.id, session: sess_email }})
        .then(function(userdata){
              console.log('id: ', userdata.data)
              res.render('editCompanyProfile', { user : userdata.data})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.editUserProfileRoute = async (req, res) => {
    const sess_email = req.session.email
    axios.get('http://localhost:'+parameters+'/api/find',{ params : { id : req.query.id, session: sess_email }})
        .then(function(userdata){
              console.log('id: ', userdata.data)
              res.render('editUserProfile', { user : userdata.data})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.changePassRoute = async (req, res) => {
    const sess_email = req.session.email
    axios.get('http://localhost:'+parameters+'/api/find',{ params : { id : req.query.id, session: sess_email }})
        .then(function(userdata){
              console.log('changePassRouteID: ', userdata.data[0]._id)
              const message = req.flash('failed')
              res.render('changePassword', { user : userdata.data[0]._id, message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.changeCompanyPassRoute = async (req, res) => {
    const sess_email = req.session.email
    axios.get('http://localhost:'+parameters+'/api/find',{ params : { id : req.query.id, session: sess_email }})
        .then(function(userdata){
              console.log('changePassRouteID: ', userdata.data)
              const message = req.flash('failed')
              res.render('changeCompanyPassword', { user : userdata.data[0]._id, message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.changeUserPassRoute = async (req, res) => {
    const sess_email = req.session.email
    axios.get('http://localhost:'+parameters+'/api/find',{ params : { id : req.query.id, session: sess_email }})
        .then(function(userdata){
              console.log('changePassRouteID: ', userdata.data)
              const message = req.flash('failed')
              res.render('changeUserPassword', { user : userdata.data[0]._id, message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};


exports.usersRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/enrolled')
        .then(function(users){
              console.log('users: ', users.data)
              const message = req.flash('success')
              res.render('enrolled_users', { users : users.data, message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.enrolledUserRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/enrolled',{ params : { id : req.query.id }})
        .then(function(users){
              console.log('users: ', users.data)
              const message = req.flash('success')

              const enrolled_courses = users.data.enrolled_courses
              console.log('enrolled_courses: ', enrolled_courses)
            // add credit hrs

            const total_credits = enrolled_courses.map(({ course_credit }) => course_credit)
            const total_paid = enrolled_courses.map(({ course_price }) => course_price)
            
            console.log('total_credits: ', total_credits)
            console.log('total_paid: ', total_paid)

            var creditsNumberArray = [];
            var paidNumberArray = [];
            var creditSum = 0;
            var paidSum = 0;

            
                // Iterate through array of string using
                // for loop
                // push all elements of array of string
                // in array of numbers by typecasting
                // them to integers using parseInt function
                for (var i = 0; i < total_credits.length; i++)
            
                    // Instead of parseInt(), Number()
                    // can also be used
                    creditsNumberArray.push(parseInt(total_credits[i]));
                    
                    // Print the array of numbers
                    console.log(creditsNumberArray);

                for (var i = 0; i < creditsNumberArray.length; i++)
                creditSum += creditsNumberArray[i]
                console.log(creditSum);

                // Paid Array Sum
                for (var i = 0; i < total_paid.length; i++)
            
                    // Instead of parseInt(), Number()
                    // can also be used
                    paidNumberArray.push(parseInt(total_paid[i]));
                    
                    // Print the array of numbers
                    console.log(paidNumberArray);

                for (var i = 0; i < paidNumberArray.length; i++)
                paidSum += paidNumberArray[i]
                console.log(paidSum);

              res.render('view_enrolled_user', { users : users.data, message, creditSum, paidSum})
          })
          .catch(err =>{
              res.send(err);
          }) 
};


exports.webinarRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/webinars')
        .then(function(webinar){
              console.log('webinar: ', webinar.data._id)
              const message = req.flash('success')
              res.render('webinar', { webinars : webinar.data, message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.userWebinarRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/webinars',{ params : { event : 'user webinar' }})
        .then(function(webinar){
              console.log('webinar: ', webinar.data[0])
              console.log('webinar: ', webinar.data[1])
              console.log('webinar: ', webinar.data[2])
              const sess_email = req.session.email
              const message = req.flash('success')
              
              res.render('user_webinar', { webinars : webinar.data, message, sess_email})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.addWebinarRoute = async (req, res) => {
    const message = req.flash('failed')
    res.render('add_webinar', {message})
}

exports.bookletRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/booklets')
        .then(function(booklet){
              console.log('changePassRouteID: ', booklet.data._id)
              const message = req.flash('success')
              res.render('booklet', { booklets : booklet.data, message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};


exports.userAboutRoute = async (req, res) => {
    const message = req.flash('failed')
    const sess_email = req.session.email
    res.render('user_about', {message, sess_email})
}

exports.userContactRoute = async (req, res) => {
    const message = req.flash('failed')
    const sess_email = req.session.email
    res.render('user_contact', {message, sess_email})
}

exports.addBookletRoute = async (req, res) => {
    const message = req.flash('failed')
    res.render('add_booklet', {message})
}

exports.audioRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/audios')
        .then(function(audio){
              console.log('audio: ', audio.data._id)
              const message = req.flash('success')
              res.render('audio', { audios : audio.data, message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.addAudioRoute = async (req, res) => {
    const message = req.flash('failed')
    res.render('add_audio', {message})
}

exports.courseRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/courses')
        .then(function(course){
              console.log('course: ', course.data)
              const message = req.flash('success')
              res.render('course', { courses : course.data, message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.addCourseRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/audios')
        .then(function(audios){
              console.log('audio: ', audios.data._id)
            axios.get('http://localhost:'+parameters+'/api/booklets')
                .then(function(booklets){
                      console.log('booklets: ', booklets.data)
                      const failed = req.flash('failed')
                        const proceed = req.flash('proceed')
                        const courseID = req.flash('courseID')
                        res.render('add_course', { audios: audios.data, booklets: booklets.data, failed, proceed, courseID}) 
                })
                .catch(err =>{
                    res.send(err);
                }) 
          })
          .catch(err =>{
              res.send(err);
          }) 
}

exports.courseDetailRoute = async (req, res) => {
    console.log("courseDetailParams: ", req.params.id)
    console.log("courseDetailQuery: ", req.query.id)
    console.log("courseDetailBody: ", req.body)
    axios.get('http://localhost:'+parameters+'/api/courses/',{ params : { id : req.query.id }})
        .then(function(course){
              console.log('course: ', course.data._id)
              res.render('course_detail', { courses : course.data})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.companyRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/company_enrolled')
        .then(function(company){
            //   console.log('audio: ', course.data)
              const message = req.flash('success')
              res.render('company', { company : company.data, message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.addCompanyRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/courses')
        .then(function(course){
            //   console.log('audio: ', course.data)
              const message = req.flash('failed')
              res.render('add_company', { courses : course.data, message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.viewCompanyRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/company_enrolled',{ params : { id : req.query.id }})
        .then(function(company){
              console.log('viewCompany: ', company.data)
              const message = req.flash('success')
              res.render('view_company', { company : company.data, message})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.editCompanyRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/company_enrolled',{ params : { id : req.query.id }})
        .then(function(company){
              console.log('editCompany: ', company.data)
              axios.get('http://localhost:'+parameters+'/api/courses/')
                .then(function(course){
                    console.log('course: ', course.data._id)
                    const message = req.flash('success')
                    res.render('edit_company', { company : company.data, courses : course.data, message})
                })
                .catch(err =>{
                    res.send(err);
                }) 
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.userHomeRoute = async (req, res) => {
    console.log("userBody: ", req.body)
    console.log("session: ", req.session)
        console.log("sess_email", req.session.email)
        const sess_email = req.session.email
        const sess_id = req.session.userID
        console.log("sess_id", sess_id)
        res.render('user_home', {sess_email})
};

exports.userLoginRoute = async (req, res) => {
    console.log("userBody: ", req.body)
    res.render('user_login')
};

exports.userOnlineTrainingRoute = async (req, res) => {
    console.log("userOnlineTrainingRoute");
    const sess_email = req.session.email
    axios.get('http://localhost:'+parameters+'/api/company_enrolled',{ params : { id : req.query.id }})
        .then(function(course){
              console.log('userCourse: ', course.data)
            //   console.log('locals: ', req.session)
              const message = req.flash('success')
              const sess_email = req.session.email
              res.render('user_onlinetraining', { courses : course.data, message, sess_email})
          })
          .catch(err =>{
              res.send(err);
          }) 
};

exports.userCourseDetailsRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/company_enrolled/',{ params : { id : req.query.id }})
        .then(function(course){
              console.log('course: ', course.data)
              const sess_email = req.session.email
              res.render('user_course', { courses : course.data, sess_email})
          })
          .catch(err =>{
              res.send(err);
          })
};

exports.userLearningRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/courses/',{ params : { id : req.query.id }})
        .then(function(course){
              console.log('course: ', course.data._id)
              const sess_email = req.session.email
              res.render('user_learning', { courses : course.data, sess_email})
          })
          .catch(err =>{
              res.send(err);
          })
};

exports.userCartRoute = async (req, res) => {
    axios.get('http://localhost:'+parameters+'/api/company_enrolled/',{ params : { id : req.query.id }})
        .then(function(course){
            const sess_email = req.session.email
              console.log('course: ', course.data._id)
              res.render('user_cart', { courses : course.data, sess_email})
          })
          .catch(err =>{
              res.send(err);
          })
};

exports.userCheckoutRoute = async (req, res) => {
    const clientId = CLIENT_ID;
    const clientToken = await generateClientToken();
    await axios.get('http://localhost:'+parameters+'/api/company_enrolled/',{ params : { id : req.query.id }})
        .then(function(course){
            console.log('course: ', course.data._id)
            const sess_email = req.session.email
            const sess_id = req.session.userID
            
                if(!sess_email){
                    const message = req.flash('success')
                    console.log("msg: ", message);
                    res.render('login', {message})
                }else{

                    res.render('user_checkout', { courses : course.data, sess_email, sess_id, clientId, clientToken})
                }
          })
          .catch(err =>{
              res.send(err);
          })
};

exports.userDashboardRoute = async (req, res) => {
    const sess_id = req.session.userID
    console.log("sess_id", sess_id)
    await axios.get('http://localhost:'+parameters+'/api/find/',{ params : { id : sess_id }})
    .then(function(enrolledUser){
        console.log("enrolledUser", enrolledUser.data)
        const id = enrolledUser.data.enrolled_courses;
        // console.log("enrolledUserIDs", id)
        // console.log("enrolledUserLen", id.length)
        // console.log("enrolledUserSize", id.size)
        const sess_email = req.session.email
        console.log("sess_email", sess_email)

        if(!sess_email){
            const message = req.flash('success')
            console.log("msg: ", message);
            res.render('login', {message})
        }else{

            res.render('user_dashboard', { courses : id, sess_email})
        }
       
    })
    .catch(err =>{
        res.send(err);
    })
    
};

exports.userExamRoute = async (req, res) => {
    const sess_email = req.session.email
    const sess_id = req.session.userID
    const sess_name = req.session.name
    const courseID = req.query.id
    console.log("sess_email", sess_email)
    console.log("sess_email", sess_id)
    console.log("req.query", req.query)
    console.log("req.query.id", courseID)
    await axios.get('http://localhost:'+parameters+'/api/findQuiz/',{ params : { courseID: req.query.id, userID: sess_id }})
    .then(quiz =>{
        console.log("quiz: ", quiz.data);
        const question = quiz.data[0]
        console.log("questions: ", question);
        if(!sess_email){
            const message = req.flash('success')
            console.log("msg: ", message);
            res.render('login', {message})
        }else{

            res.render('user_exam', { quiz: question, sess_email, sess_id, sess_name, courseID })
        } 
    })
    .catch(err =>{
        res.send(err);
   })
    
};

exports.addExamRoute = async (req, res) => {
    const sess_email = req.session.email
    const sess_id = req.session.userID
    console.log("sess_email", sess_email)
    console.log("sess_email", sess_id)
    console.log("req.query", req.query)
    await axios.get('http://localhost:'+parameters+'/api/quiz/',{ params : { courseID: req.query.id, userID: sess_id }})
    .then(quiz =>{
        console.log("quiz: ", quiz.data[0]);
        const question = quiz.data[0]
        console.log("questions: ", question);
        if(!sess_email){
            const message = req.flash('success')
            console.log("msg: ", message);
            res.render('login', {message})
        }else{

            res.render('user_exam', { quiz: question, sess_email, sess_id })
        } 
    })
    .catch(err =>{
        res.send(err);
   })
    
};



