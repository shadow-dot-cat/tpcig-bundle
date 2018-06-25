'use strict';

// Dependencies
const uuid = require('uuid/v4');
const nodecg = require('./util/nodecg-api-context').get();

// Replicants
const speakerRep = nodecg.Replicant('speaker');

// CRUD Operations

/*
nodecg.speakerCreate

Takes an object of speaker data. Requires the following information:

* name
* twitter
* website

*/
nodecg.listenFor('speakerCreate', (data, cb) => {
  nodecg.log.info('Creating speaker item');
  cb(null, addSpeaker(data));
});

/*
nodecg.speakerRead

Takes an id, and returns the speaker by that ID or undefined if unknown
*/
nodecg.listenFor('speakerRead', (data, cb) => {
  nodecg.log.info('Reading speaker item');
  cb(null, findSpeakerById(data));
});

/*
nodecg.speakerUpdate

Takes a speaker data, and updates it based on the id provided. If id doesnt
match any speakers, returns undefined
*/
nodecg.listenFor('speakerUpdate', (data, cb) => {
  nodecg.log.info('Updating speaker item');
  cb(null, updateSpeakerById(data.id, data));
});

/*
nodecg.speakerDelete

Takes an id and deletes that speaker. If found, returns true. otherwise
returns undefined
*/
nodecg.listenFor('speakerDelete', (data, cb) => {
  nodecg.log.info('Deleting speaker item');
  cb(null, deleteSpeakerById(data));
});

function addSpeaker(speaker) {
  speaker.id = uuid();
  speakerRep.value.push(speaker);
  return speaker;
}

// returns undef if it cant find speaker
function findSpeakerById(id) {
  let speaker = speakerRep.value.find(function(element) {
    return element.id === id;
  });
  return speaker;
}

function updateSpeakerById(id, update) {
  let speakerIndex = speakerRep.value.findIndex(function(element) {
    return element.id === id;
  });
  if ( speakerIndex > -1 ) {
    speakerRep.value[speakerIndex] = update;
    return speakerRep.value[speakerIndex];
  } else {
    return undefined;
  }
}

function deleteSpeakerById(id) {
  let speakerIndex = speakerRep.value.findIndex(function(element) {
    return element.id === id;
  });
  if ( speakerIndex > -1 ) {
    speakerRep.value.splice(speakerIndex, 1);
    return true;
  } else {
    return undefined;
  }
}
