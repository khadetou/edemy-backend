import Auth, { isInstructor } from "../middleware/auth";
import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../controllers/course";

const router = express.Router();

router.get("/course", Auth, isInstructor, getAllCourses);
router.post("/course", Auth, isInstructor, createCourse);

router
  .get("/course/:id", Auth, isInstructor, getCourseById)
  .put("/course/:id", Auth, isInstructor, updateCourse)
  .delete("/course/:id", Auth, isInstructor, deleteCourse);
module.exports = router;
