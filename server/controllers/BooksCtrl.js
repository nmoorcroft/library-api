'use strict';

var express = require('express');
var router = express.Router();
var db = require('../model');
var Book = db.Book;

router.get('/books', function (req, res) {
    Book.find().then(function (books) {
        res.status(200).json(books.map(asHal));
    });
});

router.get('/books/:id', function (req, res) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(404).send('invalid book id');

    } else {
        Book.findById(req.params.id).then(function (book) {
            if (!book) res.status(404).send('book not found');
            else res.status(200).json(asHal(book));
        });
    }
});

router.post('/books', function (req, res) {
    var book = new Book(req.body);
    book.save().then(function (saved) {
        res.status(201).send('/books/' + saved.id);

    }, function (err) {
        res.status(400).send(err);

    });

});

function asHal(book) {
    var id = book._id;
    var self = '/books/' + id;
    return {
        _links: {
            self: {href: self},
            loans: {href: self + '/loans'}
        },
        id: id,
        name: book.name
    }
}

module.exports = router;

