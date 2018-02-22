'use strict';

const config = {
    PORT : process.env.PORT || '3000',
    DATABASE : process.env.DATABASE || global.DATABASE_URL || 'mongodb://localhost/ToDo',
};

module.exports = config;
