'use strict';

const csv = require('csv');
const moment =require('moment');
const uuid = require('uuid/v4');

const nodecg = require('./util/nodecg-api-context').get();

const roomRep = nodecg.Replicant('room');
const scheduleRep = nodecg.Replicant('schedule');
const speakerRep = nodecg.Replicant('speaker');

nodecg.listenFor('csvImport', (data, cb) => {
  parseCsv(data, cb);
});

function parseCsv(data, cb) {
  csv.parse(data, {
    columns: true
  }, (...args) => {
    parseData( cb, args[1] );
  });
}

/*
## Speaker Keys
* user_id => act_id
* first_name
* last_name
* nick_name
(create new key display_name)

## Room
* room => act_id
* room => name (if not defined already)

## Talk
* talk_id => act_id
* title
* user_id => speaker.act_id => id
* lightning
* duration
* datetime => start_time

*/
function parseData(cb, data) {
  data.forEach((e) => {
    findOrCreateActSpeaker(e.user_id, {
      act_id: e.user_id,
      first_name: e.first_name,
      last_name: e.last_name,
      nick_name: e.nick_name
    });
    findOrCreateActRoom(e.room, {
      act_id: e.room
    });
    findOrCreateActTalk(e.talk_id, {
      act_id: e.talk_id,
      title: e.title,
      speaker_id: e.user_id,
      room_id: e.room,
      lightning: e.lightning,
      duration: e.duration,
      datetime: e.datetime
    })
  });
  cb( null, data );
}

function findOrCreateActSpeaker(act_id, data) {
  let index = speakerRep.value.findIndex((element) => {
    return element.act_id === act_id;
  });
  if ( index > -1 ) {
    // data from Act wins, but doesnt update name in case already modified
    speakerRep.value[index] = Object.assign({}, speakerRep.value[index], data);
  } else {
    let new_speaker = Object.assign({id: uuid(), name: `${data.first_name} ${data.last_name}`}, data);
    speakerRep.value.push(new_speaker);
  }
}

function findOrCreateActRoom(act_id, data) {
  let index = roomRep.value.findIndex((element) => {
    return element.act_id === act_id;
  });
  if ( index > -1 ) {
    roomRep.value[index] = Object.assign({}, roomRep.value[index], data);
  } else {
    let new_room = Object.assign({id: uuid(), name: data.act_id}, data);
    roomRep.value.push(new_room);
  }
}

function findOrCreateActTalk(act_id, data) {
  let index = scheduleRep.value.findIndex((element) => {
    return element.act_id === act_id;
  });
  let spk_index = speakerRep.value.findIndex((element) => {
    return element.act_id === data.speaker_id;
  });
  if ( spk_index > -1 ) {
    data.speaker_id = speakerRep.value[spk_index].id;
  } else {
    delete data.speaker_id;
  }
  let start_time;
  let end_time;
  console.log(data.datetime);
  console.log(data.duration);
  if ( data.datetime !== '' ) {
    start_time = moment(data.datetime);
  }
  if ( (data.duration !== '') && (start_time !== undefined) ) {
    end_time = start_time.clone();
    end_time.add(data.duration, 'minutes');
  }
  console.log(start_time);
  console.log(end_time);
  let room_index = roomRep.value.findIndex((element) => {
    return element.act_id === data.room;
  });
  if ( room_index > -1 ) {
    data.room_id = roomRep.value[room_index].id;
  } else {
    delete data.room_id;
  }
  if ( index > -1 ) {
    scheduleRep.value[index] = Object.assign({}, scheduleRep.value[index], data);
    if ( start_time ) {
      scheduleRep.value[index].start_time = start_time.toISOString();
    }
    if ( end_time ) {
      scheduleRep.value[index].end_time = end_time.toISOString();
    }
  } else {

    // its all milliseconds...
    let new_schedule = Object.assign({
      id: uuid()
    }, data);
    scheduleRep.value.push(new_schedule);
  }
}
