import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    content: {
      type: {},
      minlength: 200,
    },
    video_link: {},
    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      minlength: 200,
      required: true,
    },
    price: {
      type: Number,
      default: 9.99,
    },
    image: [
      {
        public_id: {
          type: String,
          required: true,
        },

        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: String,
    published: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
