import './Home.css';

const Home = () => {
  // Sample blog data - in a real application this would come from an API
  const blogs = [
    {
      id: 1,
      title: 'Getting Started with React',
      excerpt: 'Learn the basics of React and build your first component...',
      author: 'Jane Doe',
      date: 'May 15, 2023',
      imageUrl: 'https://picsum.photos/id/0/600/400'
    },
    {
      id: 2,
      title: 'Modern CSS Techniques',
      excerpt: 'Explore the latest CSS features that make web styling easier...',
      author: 'John Smith',
      date: 'June 2, 2023',
      imageUrl: 'https://picsum.photos/id/1/600/400'
    },
    {
      id: 3,
      title: 'JavaScript ES6 and Beyond',
      excerpt: 'Discover how modern JavaScript can improve your code quality...',
      author: 'Alex Johnson',
      date: 'June 22, 2023',
      imageUrl: 'https://picsum.photos/id/2/600/400'
    }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Super-Blogs</h1>
        <p>Discover amazing articles and share your thoughts with the world</p>
      </div>
      
      <div className="blogs-container">
        <h2>Latest Articles</h2>
        <div className="blog-grid">
          {blogs.map(blog => (
            <div className="blog-card" key={blog.id}>
              <div className="blog-image-container">
                <img src={blog.imageUrl} alt={blog.title} />
              </div>
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <div className="blog-meta">
                  <span className="blog-author">By {blog.author}</span>
                  <span className="blog-date">{blog.date}</span>
                </div>
                <button className="read-more-btn">Read More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 