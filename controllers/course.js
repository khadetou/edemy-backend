import asyncHandler from "express-async-handler";
import Course from "../models/course";
import cloudinary from "cloudinary";

//@desc Create course
//@route Post/api/courses
//@access private, Instructor
export const createCourse = asyncHandler(async (req, res) => {
  const { name, description, slug, price, published, image, paid, category } =
    req.body;

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

//@Desc Upload Video
//@Desc post/api/course/lesson/uplaod-video/:id
//@Access private instructor

export const uploadVideo = asyncHandler(async (req, res) => {
  if (req.user.id != req.params.id) {
    res.status(400);
    throw Error("Unauthorized");
  }

  let videoLinks = {};
  const {
    video: { path },
  } = req.files;

  if (path) {
    const result = await cloudinary.v2.uploader.upload(
      path,
      {
        resource_type: "video",
        type: "upload",
        use_filename: true,
        folder: "edemy/course/videos",
      },
      function (error, result) {
        console.log(error);
      }
    );
    videoLinks.public_id = result.public_id;
    videoLinks.url = result.secure_url;
  }
  res.json(videoLinks);
});

//@Desc Delete video
//@route  Post/api/course/lesson/delete-video
//@Access private isInstructor
export const deleteVideo = asyncHandler(async (req, res) => {
  const { public_id } = req.body;

  if (public_id) {
    await cloudinary.v2.uploader.destroy(public_id);
    res.json({ message: "Video has been removed successfully" });
  } else {
    res.status(404);
    throw Error("Video not found");
  }
});

//@Desc Create lesson
//@Desc post/api/course/lesson/:id
//@Access private instructor

export const createLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw Error("Course not found");
  }

  if (req.user.id.toString() !== course.instructor.toString()) {
    res.status(400);
    throw Error("Unauthorized");
  }

  const { title, video, content, slug } = req.body;
  console.log(video, title, content);
  const lesson = {};
  lesson.instructor = req.user.id;

  if (title) lesson.title = title;
  if (video) lesson.video_link = video;
  if (content) lesson.content = content;
  if (slug) lesson.slug = slug;

  course.lessons.push(lesson);
  const updated = await course.save();
  res.json(updated);
});

// const storage = multer.diskStorage({
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "video/mp4") {
//     cb(null, true);
//   } else {
//     cb(
//       {
//         message: "Unsupported file format",
//       },
//       false
//     );
//   }
// };

// const upload = multer({
//   storage,
//   limits: {
//     fieldNameSize: 200,
//     fileSize: 30 * 1024 * 1024,
//   },
//   fileFilter,
// }).single("video");

// upload(req, res, (err) => {
//   if (err) return res.send(err);
// });
// const { path: pa } = req.file;

// import { IncomingForm } from "formidable";

// const data = await new Promise((resolve, reject) => {
//   const form = new IncomingForm();

//   form.parse(req, (err, fields, file) => {
//     if (err) return reject(err);
//     resolve({ fields, file });
//   });
// });

// const file = data.file.video.path;
