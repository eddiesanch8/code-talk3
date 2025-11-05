import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// -------------------------------------------- server settings ----------------------------------------\\
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());

// -------------------------------------------- using routes --------------------------------------------\\

app.get("/api/movies", async (req, res) => {
  try {
    const userSearch = req.query.query;
    const url = `https://api.themoviedb.org/3/search/movie?query=${userSearch}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

    const data = await response.json();
    const limitedResults = data.results.slice(0, 8);

    res.json(limitedResults);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`listening on Port: ${PORT}, also here is the`);
});
