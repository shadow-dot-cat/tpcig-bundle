'use strict';

module.exports = function (nodecg) {
  nodecg.listenFor('ping', message => {
    nodecg.log.info(message);
  });
};
