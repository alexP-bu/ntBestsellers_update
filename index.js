const express = require('express');
const path = require('path');
const axios = require('axios');
const API = require('./config/API');
const Book = require('./config/Book');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    const urls = [API.URL_HARDCOVER_FICTION, API.URL_HARDCOVER_NONFICTION];
    const [fic, non] = await Promise.all(urls.map(getBooks));
    res.render('layout', {results: {fic: fic, non: non}});
});

const getBooks = async url  => {
    try {
      const res = await axios.get(url + "?api-key=" + API.Key);
      return res.data.results.books.map(book => new Book(              
        book.primary_isbn13,
        book.title,
        book.author,
        'https://www.bookshop.org/a/15886/' + book.primary_isbn13
      ));
    } catch {
      console.log(err => console.log(err));
    }
};

app.listen(8080);