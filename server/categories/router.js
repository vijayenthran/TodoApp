const express = require('express');
const router = express.Router();
const {categories} = require('./model');
const logger = require('../../logger');

// const dataFeed = [{name: 'Today'}, {name: 'Personal'}, {name: 'Errands'}, {name: 'Movies to Watch'}, {name:'Groceries'}];

// function inserData() {
//     return categories.insertMany(dataFeed)
//         .then(docs => {
//             return;
//         }).catch((err) => {
//             logger.Error(err);
//             throw err;
//         });
// }

// inserData();

router.get('/', (req, res) => {
    return categories.find({}).then(docs => {
        let categoryName = docs.map(doc => {
            return doc;
        });
        res.status(200).json(categoryName);
    }).catch(err => {
        logger.Error(err);
        res.status(500).end();
    });
});

router.post('/', (req, res) => {
    return categories.create(req.body)
        .then(data => {
            res.status(201).json(data);
        }).catch(err => {
            logger.Error(err);
            res.status(400).json(err);
        });
});

router.put('/', (req, res) => {
    let updateCategory = {_id: req.body.id};
    return categories.findOneAndUpdate(updateCategory, {name: req.body.name})
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            logger.Error(err);
            res.status(500).send(err);
        });
});

router.delete('/', (req, res) => {
    return categories.deleteOne(req.body)
        .then((data)=> {
            res.status(200).json(data);
        }).catch(err => {
            logger.Error(err);
            res.status(500).send(err);
        });
});

module.exports = router;
