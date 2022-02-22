'use strict';

const colour = require('colour');

const logger = {
  Info : function(text) {
    console.info(`[INFO] - ${text}`.bold.yellow);
  },
  Error : function(text) {
      console.error(new Error(`[ERROR] - ${text}`.bold.red));
  },
};


module.exports = logger;
