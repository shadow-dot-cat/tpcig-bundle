'use strict';

const nodecgApiContext = require('./util/nodecg-api-context');
const OBSUtility = require('nodecg-utility-obs');

module.exports = function (nodecg) {
  // MUST be first
  nodecgApiContext.set(nodecg);
  
  const obs = new OBSUtility(nodecg);
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
