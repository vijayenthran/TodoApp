'use strict';

const config = {
    PORT : process.env.PORT || '3000',
    DATABASE : process.env.DATABASE || 'mongodb://localhost/ToDo',
};

module.exports = config;
