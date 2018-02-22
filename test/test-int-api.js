'use strict';

global.DATABASE_URL = 'mongodb://localhost/Todotest';

const {app, startServer, closeServer} = require('../server/server');
const {categories} = require('../server/categories/model');
const {contents} = require('../server/contents/model');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const chai = require('chai');
chai.use(chaiHttp);
const {contentData} = require('./support/seedData');
mongoose.Promise = global.Promise;
const logger = require('../logger');


function removeCategoryData() {
    return categories.deleteMany({})
        .catch((err) => {
            logger.Error(err);
            throw err;
        });
}

function removeContents() {
    return contents.deleteMany({})
        .catch((err) => {
            logger.Error(err);
            throw err;
        });
}

function seedContentData() {
    let categoryId, modifiedContentData;
    return categories.find({}).then(docs => {
        categoryId = docs.map(doc => {
            return doc._id;
        });
        modifiedContentData = contentData.map((content, index) =>{
          content['categoryid'] = categoryId[index];
          content['categoryname'] = 'Gallery';
          return content;
        });
        return contents.insertMany(modifiedContentData);
    })
        .catch((err) => {
            logger.Error(err);
            throw err;
        });
}


describe('Integration Test For Categories', function () {
    let mockUpdateId, updateContentId;
    before(function () {
        return startServer();
    });

    after(function () {
        return closeServer();
    });

    it('Get call /categories', function () {
        return chai.request(app)
            .get('/categories')
            .then(data => {
                expect(data.statusCode).to.equal(200);
                expect(data.body.length).to.equal(5);
            });
    });

    it('Post call /categories', function () {
        let mockObj = {name: 'new-category'};
        return chai.request(app)
            .post('/categories')
            .send(mockObj)
            .then(data => {
                mockUpdateId = data.body._id;
                expect(data.statusCode).to.equal(201);
                expect(data.body.name).to.equal(mockObj.name);
            });
    });

    it('Put call /categories', function () {
        let mockObj = { id :mockUpdateId ,name: 'new-category-updated'};
        return chai.request(app)
            .put('/categories')
            .send(mockObj)
            .then(data => {
                expect(data.statusCode).to.equal(200);
                return categories.find({_id : mockUpdateId})
            }).then(data=>{
                expect(data[0].name).to.equal(mockObj.name);
            })
    });

    it('Put call /categories', function () {
        let mockObj = {name: 'new-category-updated'};
        return chai.request(app)
            .delete('/categories')
            .send(mockObj)
            .then(data => {
                expect(data.statusCode).to.equal(200);
                return categories.find({})
            }).then(docs => expect(docs.length).to.equal(5))
    });

    it('Seed Content Data', function () {
        return seedContentData();
    });

    it('Create /contents', function () {
        let mockObj = {categoryid: mockUpdateId, categoryname:'Gallery', completed:false, content:'Test Data'};
        return chai.request(app)
            .post(`/contents`)
            .send(mockObj)
            .then(data => {
                expect(data.statusCode).to.equal(201);
                expect(data.body.categoryid).to.equal(mockObj.categoryid);
                expect(data.body.categoryname).to.equal(mockObj.categoryname);
                expect(data.body.completed).to.equal(mockObj.completed);
                expect(data.body.content).to.equal(mockObj.content);
            });
    });

    it('Get /contents', function () {
        updateContentId;
        return chai.request(app)
            .get(`/contents?categoryid=${mockUpdateId}&completed=false`)
            .then(data => {
                updateContentId = data.body[0]._id;
                expect(data.statusCode).to.equal(200);
                expect(data.body[0].categoryname).to.equal('Gallery');
                expect(data.body[0].completed).to.equal(false);
            });
    });

    it('Update /contents', function () {
        let mockObj = {_id: updateContentId, mockUpdateId, categoryname:'Gallery', completed:false, content:'Test Data Updated'};
        return chai.request(app)
            .put('/contents')
            .send(mockObj)
            .then(data => {
                expect(data.statusCode).to.equal(200);
            });
    });

    it('delete /content', function () {
        let mockObj = {_id: updateContentId};
        return chai.request(app)
            .delete('/contents')
            .send(mockObj)
            .then(data => {
                expect(data.statusCode).to.equal(200);
            });
    });

    it('Remove All Documents / delete catagories and /delete contents', function () {
        return removeCategoryData().then(() => removeContents());
    });

});
