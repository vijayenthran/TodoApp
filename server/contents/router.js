const express = require('express');
const router = express.Router();
const {contents} = require('./model');
const logger = require('../../logger');


router.get('/', (req, res) => {
    return contents.find({$and:[{categoryid:req.query.categoryid},{completed :req.query.completed}]}).then(docs => {
        let content = docs.map(doc=>{
            return doc;
        }).filter(doc => {
            return doc;
        });
        res.status(200).json(content);
    }).catch(err => {
        logger.Error(err);
        res.status(500).end();
    });
});

router.post('/', (req, res) => {
    const content = req.body;
    return contents.create(content).then(content => {
        res.status(201).send(content)
    }).catch(err => {
        logger.Error(err);
        throw err;
    });
});

router.put('/', (req, res) => {
    let updateContent = {_id: req.body._id};
    let updateObj = {content: req.body.content, completed: req.body.completed};
    return contents.findOneAndUpdate(updateContent, updateObj)
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            logger.Error(err);
            res.status(500).send(err);
        });
});

router.delete('/', (req, res) => {
    return contents.deleteOne(req.body)
        .then((data)=> {
            res.status(200).json(data);
        }).catch(err => {
            logger.Error(err);
            res.status(500).send(err);
        });
});


module.exports = router;
