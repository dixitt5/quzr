import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactQuill from "react-quill";
import Select from "react-select";
import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";
import { useAuth } from "../../contexts/AuthContext";
import QuestionService from "../../services/question.service";
import tagService from "../../services/tag.service";
import "./QuestionForm.css";

// Import emoji module
import QuillEmoji from "quill-emoji";
const { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } = QuillEmoji;

// Register modules with Quill
ReactQuill.Quill.register({
  "formats/emoji": EmojiBlot,
  "modules/emoji-shortname": ShortNameEmoji,
  "modules/emoji-toolbar": ToolbarEmoji,
  "modules/emoji-textarea": TextAreaEmoji
});

const schema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters"),
  content: yup
    .string()
    .required("Content is required")
    .min(20, "Content must be at least 20 characters"),
  tags: yup
    .array()
    .min(1, "Please select at least one tag.")
    .max(5, "You can select up to 5 tags.")
    .required("Please select at least one tag.")
});

// Quill editor modules and formats
const modules = {
  toolbar: [
    ["bold", "italic", "strike"], // toggled buttons
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ align: [] }],
    ["emoji"],
    ["clean"] // remove formatting
  ],
  "emoji-toolbar": true,
  "emoji-shortname": true,
  "emoji-textarea": false
};

const formats = [
  "bold",
  "italic",
  "strike",
  "list",
  "bullet",
  "link",
  "align",
  "emoji"
];

const QuestionForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [originalQuestion, setOriginalQuestion] = useState(null);
  const [tags, setTags] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      content: "",
      tags: []
    }
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data: fetchedTags } = await tagService.getAllTags();
        const options = fetchedTags.map((tag) => ({
          value: tag.id,
          label: tag.name
        }));
        setTags(options);
      } catch (error) {
        console.error("Failed to fetch tags", error);
      }
    };
    fetchTags();
  }, []);

  // If editing, load the original question
  useEffect(() => {
    if (isEdit && id) {
      const fetchQuestion = async () => {
        try {
          const question = await QuestionService.getQuestionById(id);
          setOriginalQuestion(question);

          // Check if the current user is the author
          if (currentUser?.id !== question.authorId) {
            navigate("/");
            return;
          }

          // Set form values
          reset({
            title: question.title,
            content: question.content,
            tags:
              question.tags?.map((tag) => ({
                value: tag.id,
                label: tag.name
              })) || []
          });
        } catch (error) {
          console.error("Error fetching question:", error);
          navigate("/");
        }
      };

      fetchQuestion();
    }
  }, [isEdit, id, currentUser, reset, navigate]);

  const onSubmit = async (data) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    const questionData = {
      title: data.title,
      content: data.content,
      authorId: currentUser.id,
      tagIds: data.tags.map((tag) => tag.value)
    };

    try {
      if (isEdit) {
        await QuestionService.updateQuestion(id, questionData);
        navigate(`/questions/${id}`);
      } else {
        const newQuestion = await QuestionService.createQuestion(questionData);
        navigate(`/questions/${newQuestion.id}`);
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      setApiError(
        error.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} question. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="question-form-container">
      <div className="question-form-card">
        <h2>{isEdit ? "Edit" : "Create"} Post</h2>
        <p className="subtitle">
          {isEdit
            ? "Update your post with the latest information"
            : "Share or ask anything you want"}
        </p>

        {apiError && <div className="error-message form-error">{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="question-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className={errors.title ? "error" : ""}
              placeholder="Enter a descriptive title"
            />
            {errors.title && (
              <p className="error-message">{errors.title.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={tags}
                  classNamePrefix="react-select"
                  placeholder="Select up to 5 tags"
                />
              )}
            />
            {errors.tags && (
              <p className="error-message">{errors.tags.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  className={errors.content ? "quill-error" : ""}
                  placeholder="Write your post content here..."
                />
              )}
            />
            {errors.content && (
              <p className="error-message">{errors.content.message}</p>
            )}
          </div>

          <div className="form-actions">
            <Link
              to={isEdit && originalQuestion ? `/questions/${id}` : "/"}
              className="cancel-button"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Post"
                  : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
