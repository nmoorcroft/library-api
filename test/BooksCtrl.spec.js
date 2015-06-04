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
        createSampleBooks().then(function () {
            request(app).get('/api/books')
                .expect(200)
                .expect(function (res) {
                    assert.equal(res.body.length, 2);
                    assert.ok(_.find(res.body, _.matchesProperty('title', 'Domain-Driven Design')));
                    assert.ok(_.find(res.body, _.matchesProperty('title', 'Test-Driven Development')));
                })
                .end(done);
        });

    });

    it('should retrieve a book by id', function (done) {
        createSampleBooks().then(function (books) {
            request(app).get('/api/books/' + books[0]._id)
                .expect(function (res) {
                    assert.equal(res.body.title, books[0].title);
                    assert.equal(res.body.id, books[0]._id);
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
        var book = {title: 'Refactoring: Improving the Design of Existing Code', author: 'Martin Fowler'};
        request(app).post('/api/books')
            .set('Content-Type', 'application/json')
            .send(book)
            .expect(201)
            .end(function (err) {
                if (err) done(err);
                db.Book.find(function (err, books) {
                    assert.equal(books.length, 1);
                    assert.equal(books[0].title, 'Refactoring: Improving the Design of Existing Code');
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

    function createSampleBooks() {
        return Q.all([
            createBook('Domain-Driven Design', 'Eric Evans'),
            createBook('Test-Driven Development', 'Kent Beck')
        ]);
    }

    function createBook(title, author) {
        return new db.Book({title: title, author: author}).save();
    }


});


