import { useState } from "react";
import "./css/movie.css";

// The resolveAll function from your example
function resolveAll(promises) {
  return Promise.all(
    promises.map((promise) => {
      return promise.then((value) => value).catch((error) => `Error: ${error}`);
    })
  );
}

export default function MovieForm() {
  const [movie1, setMovie1] = useState("");
  const [movie2, setMovie2] = useState("---- `");
  const [movie3, setMovie3] = useState("");
  const [results, setResults] = useState(null);

  const fetchMovie = async (query) => {
    const res = await fetch(
      `https://divine-fascination-production-9ca2.up.railway.app/api/movies?query=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
    const data = await res.json();
    return data;
  };

  const handleSearch = async () => {
    // Create three promises
    const promise1 = fetchMovie(movie1);
    const promise2 = fetchMovie(movie2);
    const promise3 = fetchMovie(movie3);

    // Use resolveAll to handle all promises
    const allResults = await resolveAll([promise1, promise2, promise3]);
    setResults(allResults);
  };

  const renderResult = (result, index) => {
    // Check if it's an error string
    if (typeof result === "string" && result.startsWith("Error:")) {
      return (
        <div key={index} className="result-item error">
          <h3>Result {index + 1}</h3>
          <p className="error-message">{result}</p>
        </div>
      );
    }


        // Check if no movies found
    if (Array.isArray(result) && result.length === 0) {
      return (
        <div key={index} className="result-item error">
          <h3>Result {index + 1}</h3>
          <p className="error-message">No movies found</p>
        </div>
      );
    }

    // Display movies
    return (
      <div key={index} className="result-item success">
        <h3>
          Result {index + 1} - Found {result.length} movies
        </h3>
        <div className="movie-list">
          {result.map((movie) => (
            <div key={movie.id} className="movie-card">
              <h4>{movie.title}</h4>
              <p>Release: {movie.release_date || "N/A"}</p>
              <p>Rating: {movie.vote_average || "N/A"}/10</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Movie Promise Demo</h1>
      <p className="subtitle">
        Using <code>resolveAll()</code> - in a real-life scenario
      </p>

      <form className="userForm" onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <label htmlFor="movie-1">Movie Promise 1</label>
          <input
            id="movie-1"
            placeholder="Type in a movie..."
            value={movie1}
            onChange={(e) => setMovie1(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="movie-2">Movie Promise 2 (This will fail)</label>
          <input
            placeholder="Type in a movie..."
            value={movie2}
            onChange={(e) => setMovie2(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="movie-3">Movie Promise 3</label>
          <input
            id="movie-3"
            placeholder="Type in a movie..."
            value={movie3}
            onChange={(e) => setMovie3(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={!movie1 || !movie2 || !movie3}
        >
          Search All 3 Movies
        </button>
      </form>

      {results && (
        <div className="results-container">
          <h2>Results (in order)</h2>
          {results.map((result, index) => renderResult(result, index))}
        </div>
      )}
    </div>
  );
}
