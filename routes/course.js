import Auth, { isInstructor } from "../middleware/auth";
import express from "express";
import formidable from "express-formidable";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  createLesson,
  uploadVideo,
} from "../controllers/course";

const router = express.Router();

router.get("/course", Auth, isInstructor, getAllCourses);
router.post("/course", Auth, isInstructor, createCourse);

router
  .get("/course/:id", Auth, isInstructor, getCourseById)
  .post("/course/lesson/:id", Auth, isInstructor, createLesson)
  .post("/course/lesson/upload-video/:id", Auth, formidable(), uploadVideo)
  .put("/course/:id", Auth, isInstructor, updateCourse)
  .delete("/course/:id", Auth, isInstructor, deleteCourse);
module.exports = router;
