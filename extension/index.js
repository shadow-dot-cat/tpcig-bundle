'use strict';

const nodecgApiContext = require('./util/nodecg-api-context');

module.exports = function (nodecg) {
  // MUST be first
  nodecgApiContext.set(nodecg);

  // All the Replicants. Defined here as, well, need to do it somewhere and
  // its a central location.
  const scheduleRep = nodecg.Replicant('schedule', {defaultValue: []});
  const speakerRep = nodecg.Replicant('speaker', {defaultValue: []});
  const roomRep = nodecg.Replicant('room', {defaultValue: []});

  // Sub modules
  require('./speaker');
  require('./room');
  require('./schedule');

  require('./csv');

  nodecg.listenFor('ping', message => {
    nodecg.log.info(message);
  });
};
