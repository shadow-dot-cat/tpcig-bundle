'use strict';

const uuid = require('uuid/v4');
const nodecg = require('./util/nodecg-api-context').get();

const scheduleRep = nodecg.Replicant('schedule');

// CRUD Operations

/*
nodecg.scheduleCreate

Takes an object of schedule data. Requires the following information:

* id
* speaker_id
* title
* room_id
* start_time
* end_time
*/
nodecg.listenFor('scheduleCreate', (data, cb) => {
  nodecg.log.info('Creating schedule item');
  cb(null, addSchedule(data));
});

nodecg.listenFor('scheduleRead', (data, cb) => {
  nodecg.log.info('Reading schedule item');
  cb(null, findScheduleById(data));
});

nodecg.listenFor('scheduleUpdate', (data, cb) => {
  nodecg.log.info('Updating schedule item');
  cb(null, updateScheduleById(data.id, data));
});

nodecg.listenFor('scheduleDelete', (data, cb) => {
  nodecg.log.info('Deleting schedule item');
  cb(null, deleteScheduleById(data));
});

function addSchedule(schedule) {
  schedule.id = uuid();
  scheduleRep.value.push(schedule);
  return schedule;
}

// returns undef if it cant find schedule
function findScheduleById(id) {
  let schedule = scheduleRep.value.find(function(element) {
    return element.id === id;
  });
  return schedule;
}

function updateScheduleById(id, update) {
  let scheduleIndex = scheduleRep.value.findIndex(function(element) {
    return element.id === id;
  });
  if ( scheduleIndex > -1 ) {
    scheduleRep.value[scheduleIndex] = Object.assign({}, scheduleRep.value[scheduleIndex], update);;
    return scheduleRep.value[scheduleIndex];
  } else {
    return undefined;
  }
}

function deleteScheduleById(id) {
  let scheduleIndex = scheduleRep.value.findIndex(function(element) {
    return element.id === id;
  });
  if ( scheduleIndex > -1 ) {
    scheduleRep.value.splice(scheduleIndex, 1);
    return true;
  } else {
    return undefined;
  }
}
