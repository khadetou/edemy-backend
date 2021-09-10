import asyncHandler from "express-async-handler";
import Course from "../models/course";
import cloudinary from "cloudinary";

//@desc Create course
//@route Post/api/courses
//@access private, Instructor
export const createCourse = asyncHandler(async (req, res) => {
  const { name, description, slug, price, published, image, paid, category } =
    req.body;
  console.log(category);

  const courseField = {};

  let imagesLinks = [];

  if (image) {
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "edemy/course",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  if (name) courseField.name = name;
  if (description) courseField.description = description;
  if (slug) courseField.slug = slug;
  if (price) courseField.price = price;
  if (published) courseField.published = published;
  if (paid) courseField.paid = paid;
  if (category) courseField.category = category;

  courseField.image = imagesLinks;
  courseField.instructor = req.user.id;

  let course = Course.findOne({ user: req.user.id });

  course = new Course(courseField);
  await course.save();

  res.json({ course, success: true });
});

//@desc Get all  courses
//@route Get/api/courses
//@access private, Instructor
export const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

//@desc Get a single course
//@route Get/api/courses/:id
//@access private, Instructor
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

//@desc update course
//@route Put/api/courses/:id
//@access private, Instructor
export const updateCourse = asyncHandler(async (req, res) => {
  const { name, description, slug, price, published, image, paid, category } =
    req.body;

  let imagesLinks = [];

  const course = await Course.findById(req.params.id);
  if (course) {
    if (image) {
      await cloudinary.v2.uploader.destroy(course.image[0].public_id, {
        folder: "edemy/course",
      });
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "edemy/course",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });

      course.image = imagesLinks || course.image;
    }

    (course.name = name || course.name),
      (course.description = description || course.description),
      (course.slug = slug || course.slug),
      (course.price = price || course.price),
      (course.published = published || course.published),
      (course.paid = paid || course.paid),
      (course.category = category || course.category);
  } else {
    res.status(404);
    throw Error("No course found with this id");
  }

  const updatedCourse = await course.save();
  res.json({ updatedCourse, success: true });
});

//@desc Delete course
//@route delete/api/courses
//@access private, Instructor

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    await cloudinary.v2.uploader.destroy(course.image[0].public_id);
    await course.remove();
    res.json({ message: "Course removed successfully", success: true });
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});
