const express = require('express');
const path = require('path');
const axios = require('axios');
const API = require('./config/API');
const Book = require('./config/Book');
const List = require('./config/List')

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
	const results = await getBooks2();
	res.render('layout', { results: results });
});

async function getBooks2() {
	try {
		const res = await axios.get(API.URL_FULL_OVERVIEW + "?api-key=" + process.env.NT_API_KEY);
		return res.data.results.lists.map(list => new List(
		  	list.list_name,
			list.updated,
			list.books.map(book => new Book(
				book.primary_isbn13,
				book.title,
				book.author,
				'https://www.bookshop.org/a/15886/' + book.primary_isbn13
			))
		))
	} catch {
		  console.log(err => console.log(err));
	}
}

app.listen(8080);