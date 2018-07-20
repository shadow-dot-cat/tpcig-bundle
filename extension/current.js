'use strict';

const nodecg = require('./util/nodecg-api-context').get();

const currentTalksRep = nodecg.Replicant('currentTalks');
const roomOrderRep = nodecg.Replicant('roomOrder');
const scheduleRep = nodecg.Replicant('schedule');
const roomRep = nodecg.Replicant('room');

nodecg.listenFor('currentTalkSet', (data, cb) => {
  nodecg.log.info('Setting Current Talk for Room');
  cb(null, setCurrentTalk(data));
});

nodecg.listenFor('roomOrderSet', (data, cb) => {
  nodecg.log.info('Setting Room priority Order');
  cb(null, setRoomOrder(data));
})

function setCurrentTalk(data) {
  currentTalksRep.value[data.room_id] = data.schedule_id;
  return true;
}

function setRoomOrder(data) {
  roomOrderRep.value = data;
}
