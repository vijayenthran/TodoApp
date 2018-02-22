'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const logger = require('../logger');
const config = require('../Config');
const path = require('path');
const categoriesRouter = require('./categories/router');
const contentsRouter = require('./contents/router');
let server;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.resolve('./client/main')));
app.use(express.static(path.resolve('./client')));


app.use('/categories', categoriesRouter);
app.use('/contents', contentsRouter);



app.get('/todo', (req, res)=>{
   res.sendFile(path.resolve('./client/index.html'));
});

app.get('/', (req, res)=>{
    res.sendFile(path.resolve('./client/main'));
});

function startServer() {
    return mongoose.connect(config.DATABASE)
        .then(() => {
            return new Promise((resolve, reject) => {
                server = app.listen(config.PORT, () => {
                    logger.Info(`Sever Started and Listening on Port ${config.PORT}`);
                    resolve();
                }).on('error', err => {
                    logger.Error(err);
                    reject(err);
                });
            });
        });
}



function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            logger.Info(`Sever Closing`);
            server.close(err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    });
}


if (require.main === module) {
    startServer().catch(err => logger.Error(err));
}

module.exports = {app, startServer, closeServer};
