import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const mockAPI = "https://68e2e72a8e14f4523dac110b.mockapi.io/api/v1/favourites";

  const searchBooks = async () => {
    if (!query) return;
    const res = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
    setBooks(res.data.docs.slice(0, 8)); 
  };

  const fetchFavorites = async () => {
    const res = await axios.get(mockAPI);
    setFavorites(res.data);
  };

const addFavorite = async (book) => {
  const exists = favorites.some((fav) => fav.title === book.title);
  if (exists) {
    alert("This book is already in your favorites!");
    return;
  }

  const fav = {
    title: book.title,
    author: book.author_name ? book.author_name[0] : "Unknown",
    cover: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "https://via.placeholder.com/128x180?text=No+Cover",
  };

  await axios.post(mockAPI, fav);
  fetchFavorites();
};

  const removeFavorite = async (id) => {
    await axios.delete(`${mockAPI}/${id}`);
    fetchFavorites();
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="container">
      <h1>📚 Book Tracker</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
        />
        <button onClick={searchBooks}>Search</button>
      </div>
      
      {books.length > 0 && (
  <>
      <h2>Search Results</h2>
      <div className="grid">
        {books.map((book, i) => (
          <div key={i} className="card">
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : "https://via.placeholder.com/128x180?text=No+Cover"
              }
              alt={book.title}
            />
            <h3>{book.title}</h3>
            <p>{book.author_name ? book.author_name[0] : "Unknown Author"}</p>
         <button
  onClick={(e) => {
    addFavorite(book);
    e.target.textContent = "✓ Added!";
    e.target.disabled = true;
    e.target.style.background = "#27ae60";
  }}
>
  Add to Favorites
</button>

          </div>
        ))}
      </div>
</>
      )}
     
{favorites.length > 0 && (
  <>
    <h2>Your Favorites</h2>
    <div className="grid">
      {favorites.map((book) => (
        <div key={book.id} className="card">
          <img src={book.cover} alt={book.title} />
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <button className="remove" onClick={() => removeFavorite(book.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  </>
)}

    </div>
  );
}

export default App;
