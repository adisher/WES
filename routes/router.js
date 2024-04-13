const router = require("express").Router();
const services = require('../services/render');

// Bring in the User Registration function
const {
  deleteInfo,
  suspendInfo,
  activeInfo,
  blockInfo,
  unblockInfo,
  find,
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  setPassword,
  changePassword,
  updateProfile,
  addBooklet,
  addAudio,
  addWebinar,
  findWebinar,
  findBooklet,
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
  getCountries
} = require("../utils/Auth");

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
   cb(null, 'uploads');
  },
  filename: function(req, file, cb) {
   console.log(file);
   cb(null, Date.now() + "-" + file.originalname);
  }
 });

const upload = multer({ storage: storage }).fields([{
  name: 'thumbnail', maxCount: 1
}, {
  name: 'pdf', maxCount: 1
}, {
    name: 'audio', maxCount: 1
}, {
    name: 'video', maxCount: 1
}]);


// delete
router.get('/delete', async (req, res) => {
  console.log('query: ', req.query)
  if(req.query.webinarID){
    await deleteInfo(req, "webinar", "user", res);
  }else if(req.query.audioID){
    await deleteInfo(req, "audio", "user", res);
  }else if(req.query.bookletID){
    await deleteInfo(req, "booklet", "user", res);
  }else if(req.query.courseID){
    await deleteInfo(req, "course", "user", res);
  }else if(req.query.removeCourseID && req.query.companyID){
    await deleteInfo(req, "remove", "user", res);
  }else if(req.query.companyID){
    await deleteInfo(req, "company", "user", res);
  }else if(req.query.userID){
    await deleteInfo(req, "user", "user", res);
  }else if(req.query.companyUserID){
    await deleteInfo(req, "companyUser", "user", res);
  }

});

// suspend
router.get('/suspend', async (req, res) => {
  console.log('query: ', req.query)
  if(req.query.webinarID){
    await suspendInfo(req, "webinar", "user", res);
  }else if(req.query.audioID){
    await suspendInfo(req, "audio", "user", res);
  }else if(req.query.bookletID){
    await suspendInfo(req, "booklet", "user", res);
  }else if(req.query.courseID){
    await suspendInfo(req, "course", "user", res);
  }else if(req.query.userID){
    await suspendInfo(req, "user", "user", res);
  }else if(req.query.companyID){
    await suspendInfo(req, "company", "user", res);
  }else if(req.query.companyUserID){
    await suspendInfo(req, "companyUser", "user", res);
  }

});

// active
router.get('/active', async (req, res) => {
  console.log('query: ', req.query)
  if(req.query.webinarID){
    await activeInfo(req, "webinar", "user", res);
  }else if(req.query.audioID){
    await activeInfo(req, "audio", "user", res);
  }else if(req.query.bookletID){
    await activeInfo(req, "booklet", "user", res);
  }else if(req.query.courseID){
    await activeInfo(req, "course", "user", res);
  }else if(req.query.userID){
    await activeInfo(req, "user", "user", res);
  }else if(req.query.companyID){
    await activeInfo(req, "company", "user", res);
  }else if(req.query.companyUserID){
    await activeInfo(req, "companyUser", "user", res);
  }

});

// block
router.get('/block', async (req, res) => {
  console.log('query: ', req.query)
  if(req.query.webinarID){
    await blockInfo(req, "webinar", "user", res);
  }else if(req.query.audioID){
    await blockInfo(req, "audio", "user", res);
  }else if(req.query.bookletID){
    await blockInfo(req, "booklet", "user", res);
  }else if(req.query.courseID){
    await blockInfo(req, "course", "user", res);
  }else if(req.query.userID){
    await blockInfo(req, "user", "user", res);
  }else if(req.query.companyID){
    await blockInfo(req, "company", "user", res);
  }else if(req.query.companyUserID){
    await blockInfo(req, "companyUser", "user", res);
  }

});

// unblock
router.get('/unblock', async (req, res) => {
  console.log('query: ', req.query)
  if(req.query.webinarID){
    await unblockInfo(req, "webinar", "user", res);
  }else if(req.query.audioID){
    await unblockInfo(req, "audio", "user", res);
  }else if(req.query.bookletID){
    await unblockInfo(req, "booklet", "user", res);
  }else if(req.query.courseID){
    await unblockInfo(req, "course", "user", res);
  }else if(req.query.userID){
    await unblockInfo(req, "user", "user", res);
  }else if(req.query.companyID){
    await unblockInfo(req, "company", "user", res);
  }else if(req.query.companyUserID){
    await unblockInfo(req, "companyUser", "user", res);
  }

});

// Logout
router.get('/logout', async (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/login')
      }
    });
  }
});

// Users Countries Route
router.get("/api/countries", async (req, res) => {
  console.log('req: ', req.body)
  await getCountries(req, "user", res);
});

// Users Registeration Route
router.post("/api/register-user", async (req, res) => {
  console.log('req: ', req.body)
  await userRegister(req.body, req, "user", res);
});

// Admin Registration Route
router.post("/api/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});

// Super Admin Registration Route
router.post("/api/register-super-admin", async (req, res) => {
  console.log("reg: ", req.body)
  await userRegister(req.body, req, "superadmin", res);
});

// Users Login Route
router.post("/api/login-user", async (req, res) => {
  console.log("LoginPostAPICall");
  await userLogin(req.body, res);
});

// Admin Login Route
router.post("/api/login-admin", async (req, res) => {
  console.log("LoginPostAPICall");
  await userLogin(req.body, "admin", res);
});

// Super Admin Login Route
router.post("/api/login-super-admin", async (req, res) => {
  console.log('loginReq: ', req.body)
  console.log("res.session", req.session)
  await userLogin(req, res);
});


// Admin Set Password Route
router.post('/api/set-password/:id', async (req, res) => {
  console.log('pass: ', req.body)
  await setPassword(req, "superadmin", res);
});

// User Set Password Route
router.post('/api/setUserPassword/:id', async (req, res) => {
  console.log('pass: ', req.body)
  await setPassword(req, "user", res);
});

// User Update Profile Route
router.post('/api/updateProfile/:id', async (req, res) => {
  console.log('pass: ', req.body)
  await updateProfile(req, "superadmin", res);
});

// Company Update Profile Route
router.post('/api/updateCompanyProfile/:id', async (req, res) => {
  console.log('pass: ', req.body)
  await updateProfile(req, "company", res);
});

// User Update Profile Route
router.post('/api/updateUserProfile/:id', async (req, res) => {
  console.log('pass: ', req.body)
  await updateProfile(req, "user", res);
});

// User Change Password Route
router.post('/api/changePassword/:id', async (req, res) => {
  console.log('pass: ', req.body)
  await changePassword(req, "superadmin", res);
});

// Company Change Password Route
router.post('/api/changeCompanyPassword/:id', async (req, res) => {
  console.log('pass: ', req.body)
  await changePassword(req, "company", res);
});

// Company User Password Route
router.post('/api/changeUserPassword/:id', async (req, res) => {
  console.log('pass: ', req.body)
  await changePassword(req, "user", res);
});

// User Checkout Route
router.post('/api/checkout/:id', async (req, res) => {
  console.log('pass: ', req.body);
  await checkout(req, "superadmin", res);
});

// find all users
router.get("/api/find", async (req, res) => {
  console.log('req.query: ', req.query)
  if(req.query.role == 'user'){
    await find(req, "user", res);
  }else if(req.query.role == 'company') {
    await find(req, "company", res);
  }else {
    await find(req, "superadmin", res);
  }
});

// find all enrolled users
router.get("/api/enrolled", async (req, res) => {
  console.log("enrolled");
  await find(req, "user", res);
});

// find all enrolled users
router.get("/api/company_enrolled", async (req, res) => {
  console.log("company_enrolled");
  await find(req, "company", res);
});

// Find booklets
router.get("/api/booklets", async (req, res) => {
  console.log('booklet: ', req.body)
  await findBooklet(req, "superadmin", res);
});

// Add booklets
router.post("/api/booklets", upload, async (req, res) => {
  console.log('booklet: ', req.body)
  await addBooklet(req, "superadmin", res);
});

// Find Webinars
router.get("/api/webinars", async (req, res) => {
  console.log('webinars: ', req.body)
  console.log('req.params: ', req.params)
  console.log('req.query: ', req.query)
  if(req.query.category == 'Live Now'){
    await findWebinar(req, "Live Now", res);
  }
  else if(req.query.event == 'user webinar'){
    await findWebinar(req, "user", res);
  }else{
    await findWebinar(req, "superadmin", res);
  }
});

// find all users webinar
router.get("/api/webinar_category", async (req, res) => {
  await find(req, "category", res);
});

// Add Webinar
router.post("/api/webinars", async (req, res) => {
  console.log('webinar: ', req.body)
  await addWebinar(req, "superadmin", res);
});

// Find Audios
router.get("/api/audios", async (req, res) => {
  console.log('audios: ', req.body)
  await findAudio(req, "superadmin", res);
});

// Add Audios
router.post("/api/audios", upload, async (req, res) => {
  console.log('audio: ', req.body)
  await addAudio(req, "superadmin", res);
});

// Find Courses
router.get("/api/courses", async (req, res) => {
  console.log('courses: ', req.body)
  await findCourses(req, "superadmin", res);
});

// Add Courses
router.post("/api/courses", async (req, res) => {
  console.log('course: ', req.body)
  await addCourse(req, "superadmin", res);
});

// Add Courses Video
router.post("/api/course-video", upload, async (req, res) => {
  console.log('courseVideo: ', req.body)
  await addCourseVideo(req, "superadmin", res);
});

// Find Company
router.get("/api/company", async (req, res) => {
  console.log('company: ', req.body)
  await findCompany(req, "company", res);
});

// Add Company
router.post("/api/company", async (req, res) => {
  console.log('course: ', req.body)
  await addCompany(req, "company", res);
});

// Update Company
router.post("/api/company/:id", async (req, res) => {
  console.log('company: ', req.body)
  console.log('company: ', req.query)
  await updateCompany(req, "company", res);
});

// Add Quiz Questions
router.get("/api/quiz", async (req, res) => {
  console.log('quizPost: ', req.query)
  await addQuiz(req, "user", res);
});

// Find Quiz Questions
router.get("/api/findQuiz", async (req, res) => {
  console.log('quizGET: ', req.query)
  await findQuiz(req, "user", res);
});

// Check Quiz
router.get("/api/checkQuiz", async (req, res) => {
  console.log('quizCheck: ', req.query)
  await checkQuiz(req, "user", res);
});

// Generate Certificate
router.get("/api/certificate", async (req, res) => {
  console.log('cert: ', req.query)
  await certificate(req, "user", res);
});

// Forgot Password
router.post("/api/forgotPassword", async (req, res) => {
  console.log('forgotPassword: ', req.body)
  await forgotPassword(req, "user", res);
});

// verify otp
router.post("/api/verifyOTP/:id", async (req, res) => {
  console.log('verifyOTP: ', req.body)
  await verifyOTP(req, "user", res);
});

// Set Admin Password Route
router.get("/setAdminPassword", services.setAdminPassRoute);

// Set Company Password Route
router.get("/setCompanyPassword", services.setCompanyPassRoute);

// Set User Password Route
router.get("/setUserPassword", services.setUserPassRoute);

// Login Route
router.get("/login", services.loginRoute);

// User Signup Route
router.get("/signup", services.userSignupRoute);

// Admin Dashboard Route
router.get("/dashboard", services.dashboardRoute);

// Company Dashboard Route
router.get("/company_dashboard", services.companyDashboardRoute);

// Company Users Route
router.get("/company_users", services.companyUsersRoute);

// Add Company Users Route
router.get("/add_student", services.addStudentRoute);

// View Company Users Route
router.get("/view_student", services.viewCompanyUsersRoute);

// Add Company Courses Route
router.get("/company_courses", services.companyCoursesRoute);

// Admin Profile Route
router.get("/profile", services.adminProfileRoute);

// Company Profile Route
router.get("/company_profile", services.companyProfileRoute);

// User Profile Route
router.get("/user_profile", services.userProfileRoute);

// Edit Admin Route
router.get("/editProfile", services.editProfileRoute);

// Edit Company Route
router.get("/editCompanyProfile", services.editCompanyProfileRoute);

// Edit User Route
router.get("/editUserProfile", services.editUserProfileRoute);

// Change Password Route
router.get("/changePassword", services.changePassRoute);

// Change Company Password Route
router.get("/changeCompanyPassword", services.changeCompanyPassRoute);

// Change User Password Route
router.get("/changeUserPassword", services.changeUserPassRoute);

// Enrolled Users Route
router.get("/users", services.usersRoute);


router.get("/enrolled_user", services.enrolledUserRoute);

// Webinar Route
router.get("/webinars", services.webinarRoute);

// Add Webinars Route
router.get("/add_webinar", services.addWebinarRoute);

// Booklets Route
router.get("/booklets", services.bookletRoute);

// Add Booklets Route
router.get("/add_booklet", services.addBookletRoute);

// Audio Route
router.get("/audios", services.audioRoute);

// Add Booklets Route
router.get("/add_audio", services.addAudioRoute);

// Courses Route
router.get("/courses", services.courseRoute);

// Add Course Route
router.get("/add_course", services.addCourseRoute);

// Course Detail Route
router.get("/course_details", services.courseDetailRoute);

// Company Route
router.get("/company", services.companyRoute);

// Add Company Route
router.get("/add_company", services.addCompanyRoute);

// View Company Route
router.get("/view_company", services.viewCompanyRoute);

// View Company Route
router.get("/edit_company", services.editCompanyRoute);

// Web Home Route
router.get("/", services.userHomeRoute);

// Web Home Route
router.get("/home", services.userHomeRoute);

// Web Login Route
router.get("/userlogin", services.userLoginRoute);

// Online Training Route
router.get("/onlinetraining", services.userOnlineTrainingRoute);

// User Course Details Route
router.get("/course", services.userCourseDetailsRoute);

// User Cart Route
router.get("/cart", services.userCartRoute);

// User Checkout Route
router.get("/checkout", services.userCheckoutRoute);

// User Dashboard Route
router.get("/userDashboard", services.userDashboardRoute);

// User Exam Route
router.get("/exam", services.userExamRoute);

// User Exam Route
router.get("/addExam", services.addExamRoute);

// User Learning Route
router.get("/learning", services.userLearningRoute);

// User About Route
router.get("/about", services.userAboutRoute);

// User Contact Route
router.get("/contact", services.userContactRoute);

// User Webinar Route
router.get("/webinar", services.userWebinarRoute);

router.get("/test", services.paypal);

router.get("/forgotPassword", services.forgotPasswordRoute);

router.get("/otp", services.otpRoute);

// // Profile Route
// router.get("/profile", userAuth, async (req, res) => {
//   return res.json(serializeUser(req.user));
// });

// Users Protected Route
router.get(
  "/user-protectd",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    return res.json("Hello User");
  }
);

// Admin Protected Route
router.get(
  "/admin-protectd",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json("Hello Admin");
  }
);

// Super Admin Protected Route
router.get(
  "/super-admin-protectd",
  userAuth,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json("Hello Super Admin");
  }
);

// Super Admin Protected Route
router.get(
  "/super-admin-and-admin-protectd",
  userAuth,
  checkRole(["superadmin", "admin"]),
  async (req, res) => {
    return res.json("Super admin and Admin");
  }
);

module.exports = router;