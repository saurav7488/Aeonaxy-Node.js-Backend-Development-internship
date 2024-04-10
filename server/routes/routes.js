const express = require('express') 
const router = express.Router() 
const usercontroller = require('../controller/userController')
const admincontroller = require('../controller/adminController')
const checkAuthenticatedUser = require('../middleware/authUsermiddleware')
const checkAuthenticatedAdmin = require('../middleware/checkAdminAuthentication')
const courseController = require('../controller/courseController')
const enrollmentController = require('../controller/enrollmentController')
const showCourse = require('../controller/ShowCourses')

router.post('/register',usercontroller.userRegister)

// user API
router.post('/userslogin',usercontroller.loginUsers)
router.get('/users/:id',checkAuthenticatedUser,usercontroller.getUser)
router.put('/users/:id',checkAuthenticatedUser,usercontroller.updateUser)


// admin API 


router.post('/admin-login',admincontroller.adminlogin)


// course api 

router.post('/course', checkAuthenticatedAdmin, courseController.createCourse);
router.get('/course/:id',checkAuthenticatedAdmin, courseController.getCourseById);
router.put('/course/:id', checkAuthenticatedAdmin, courseController.updateCourse);
router.delete('/course/:id', checkAuthenticatedAdmin, courseController.deleteCourse);


// get all course with pagination

router.get('/show-course', showCourse.getAllCourses);


// Enrollment api 

router.post('/course-enrollment/:id',checkAuthenticatedUser,enrollmentController.enrollUser)
router.get('/user-enrolled/:id',checkAuthenticatedUser,enrollmentController.userEnrolledCourse)



module.exports = router