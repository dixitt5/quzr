import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import QuestionList from "../components/Question/QuestionList";
import tagService from "../services/tag.service";
import TagFilterDropdown from "../components/Tag/TagFilterDropdown";
import "./Home.css";

const Home = () => {
  const [filter, setFilter] = useState("newest");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagService.getAllTags();
        setTags(response.data);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    fetchTags();
  }, []);

  const handleTagChange = (tagName) => {
    if (tagName) {
      // Single selection: replace current selection
      setSelectedTags([tagName]);
    } else {
      // Clear selection
      setSelectedTags([]);
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">All Questions</h1>
        <Link to="/questions/new" className="ask-question-btn">
          Ask New Question
        </Link>
      </div>

      <div className="home-filters">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "newest" ? "active" : ""}`}
            onClick={() => setFilter("newest")}
          >
            Newest
          </button>
          <button
            className={`filter-btn ${filter === "unanswered" ? "active" : ""}`}
            onClick={() => setFilter("unanswered")}
          >
            Unanswered
          </button>
        </div>
        <div className="tag-filters">
          <TagFilterDropdown
            tags={tags}
            selectedTags={selectedTags}
            onTagChange={handleTagChange}
          />
        </div>
      </div>

      <div className="home-content">
        <QuestionList
          key={filter + selectedTags.join(",")}
          filter={filter}
          tags={selectedTags}
        />
      </div>
    </div>
  );
};

export default Home;
