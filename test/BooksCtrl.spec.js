'use strict';

var Q = require('q');
var _ = require('lodash');
var request = require('supertest');
var assert = require('chai').assert;
var init = require('./helpers/setup');

describe('books api', function () {

    var app, db;

    beforeEach(function (done) {
        init.mongo().then(function () {
            app = init.app(require('../server/controllers/BooksCtrl'));
            db = require('../server/model');
        }).then(done);
    });

    it('should retrieve all books in the library', function (done) {
        createBook('book1')
            .then(createBook('book2'))
            .then(function () {
                request(app).get('/api/books')
                    .expect(200)
                    .expect(function (res) {
                        assert.equal(res.body.length, 2);
                        assert.ok(_.find(res.body, _.matchesProperty('name', 'book1')));
                        assert.ok(_.find(res.body, _.matchesProperty('name', 'book2')));
                    })
                    .end(done);
            });

    });

    it('should retrieve a book by id', function (done) {
        createBook('book1')
            .then(function (book) {
                request(app).get('/api/books/' + book._id)
                    .expect(function (res) {
                        assert.equal(res.body.name, 'book1');
                        assert.equal(res.body.id, book._id);
                    })
                    .expect(200)
                    .end(done);
        });

    });

    it('should get 404 for invalid id', function (done) {
        request(app).get('/api/books/123')
            .expect(404)
            .end(done);

    });

    it('should get 404 for unknown id', function (done) {
        request(app).get('/api/books/5536958388a60d701386ffbc')
            .expect(404)
            .end(done);

    });

    it('should add a new book to the library', function (done) {
        var book = {name: "new book"};
        request(app).post('/api/books')
            .set('Content-Type', 'application/json')
            .send(book)
            .expect(201)
            .end(function (err) {
                if (err) done(err);
                db.Book.find(function (err, books) {
                    assert.equal(books.length, 1);
                    assert.equal(books[0].name, 'new book');
                    done(err);

                });

            });

    });

    it('should return 400 for invalid post', function (done) {
        var book = {};
        request(app).post('/api/books')
            .set('Content-Type', 'application/json')
            .send(book)
            .expect(400)
            .end(done);

    });


    function createBook(name) {
        return new db.Book({name: name}).save();
    }


});


