'use strict';

const blockedAt = require('blocked-at');

module.exports = function(app) {
  blockedAt(
    (ms, stack) => {
      console.log('Event loop blocked for', ms, 'milliseconds', stack);
    }
  );
};
