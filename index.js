import express from "express";
import axios from "axios";
import pg from "pg";
import methodOverride from "method-override"; 
import { ppid } from "process";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));
app.use(methodOverride('_method'));

const db = new pg.Client({
  user: "xxx",
  host: "xxx",
  database: "xxx",
  password: "xxx",
  port: 5432,
});

db.connect();

app.get("/", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM books");
        const books = result.rows;
        res.render("index.ejs", {books: books});
    } catch {
        console.error('Erro ao adicionar o livro:', error);
        return res.status(400).send('Não há livros.');
    }
});

app.post("/add", async (req, res) => {
    const { bookTitle, bookRating, bookNotes } = req.body;
    if (!bookTitle || !bookRating || !bookNotes) {
        return res.status(400).send('Por favor, forneça um título, classificação e notas para adicionar um livro.');
    }
    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookTitle)}`);
        if (response.data.items && response.data.items.length > 0) {
            const { title, authors, imageLinks } = response.data.items[0].volumeInfo;
            const imageUrl = imageLinks.thumbnail;

            await db.query('INSERT INTO books (title, authors, imgurl, rating, notes) VALUES ($1, $2, $3, $4, $5)', [title, authors, imageUrl, bookRating, bookNotes]);
            res.redirect('/');
        } else {
            return res.status(404).send('Livro não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao adicionar o livro:', error);
        return res.status(500).send('Erro interno do servidor.');
    }
});

app.delete('/delete', (req, res) => {
    const bookId = req.body.bookId;
        try{
            db.query("DELETE FROM books WHERE id = $1", [bookId]);
            res.redirect('/');
        }catch{
            return res.status(404).send('Livro não encontrado.');
        }
});


app.listen(port, (req, res) => {
    console.log('Server ON');
});