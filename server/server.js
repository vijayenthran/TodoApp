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
app.use(express.static(path.resolve('./client')));

app.use('/categories', categoriesRouter);
app.use('/contents', contentsRouter);

app.get('/', (req, res)=>{
   res.sendFile(path.resolve('./client'));
});


function startServer() {
    return mongoose.connect(config.DATABASE)
        .then(() => {
            return new Promise((resolve, reject) => {
                server = app.listen(config.PORT, () => {
                    logger.Info(`Sever Started and Listening on Port ${config.PORT}`);
                    resolve();
                    return;
                }).on('error', err => {
                    logger.Error(err);
                    reject(err);
                });
            });
        });
}

function stopServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                server.close('error', (err) => {
                    if (err) {
                        logger.Error(err);
                        reject(err);
                    } else {
                        resolve();
                        return;
                    }
                });
            });
        });
}

if (require.main === module) {
    startServer().catch(err => logger.Error(err));
}
