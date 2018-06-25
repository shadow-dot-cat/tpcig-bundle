'use strict';

const uuid = require('uuid/v4');
const nodecg = require('./util/nodecg-api-context').get();

// Replicants
const roomRep = nodecg.Replicant('room');

/*
A Room has the following information:

* name
* id
*/
nodecg.listenFor('roomCreate', (data, cb) => {
  nodecg.log.info('Creating room item');
  cb(null, addRoom(data));
});

nodecg.listenFor('roomRead', (data, cb) => {
  nodecg.log.info('Reading room item');
  cb(null, findRoomById(data));
});

nodecg.listenFor('roomUpdate', (data, cb) => {
  nodecg.log.info('Updating room item');
  cb(null, updateRoomById(data.id, data));
});

nodecg.listenFor('roomDelete', (data, cb) => {
  nodecg.log.info('Deleting room item');
  cb(null, deleteRoomById(data));
});

function addRoom(room) {
  room.id = uuid();
  roomRep.value.push(room);
  return room;
}

// returns undef if it cant find room
function findRoomById(id) {
  let room = roomRep.value.find(function(element) {
    return element.id === id;
  });
  return room;
}

function updateRoomById(id, update) {
  let roomIndex = roomRep.value.findIndex(function(element) {
    return element.id === id;
  });
  if ( roomIndex > -1 ) {
    roomRep.value[roomIndex] = Object.assign({}, roomRep.value[roomIndex], update);
    return roomRep.value[roomIndex];
  } else {
    return undefined;
  }
}

function deleteRoomById(id) {
  let roomIndex = roomRep.value.findIndex(function(element) {
    return element.id === id;
  });
  if ( roomIndex > -1 ) {
    roomRep.value.splice(roomIndex, 1);
    return true;
  } else {
    return undefined;
  }
}
