'use strict';

const moment =require('moment');
const uuid = require('uuid/v4');
const http = require('http');
const url = require('url');

const nodecg = require('./util/nodecg-api-context').get();

const roomRep = nodecg.Replicant('room');
const scheduleRep = nodecg.Replicant('schedule');
const speakerRep = nodecg.Replicant('speaker');

nodecg.listenFor('refreshActData', (data, cb) => {
  getActData(data, cb);
})

function getActData(data, cb) {
  const apiTalkUrl = url.format({
    protocol: 'http',
    hostname: 'act.perlconference.org',
    pathname: '/tpc-2018-glasgow/api/get_talks',
    query: {
      api_key: nodecg.bundleConfig.actApiKey,
      fields: 'user_id,room,talk_id,title,lightning,duration,datetime,speaker'
    }
  });
  http.get(apiTalkUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      parseData(cb, JSON.parse(data));
    });
  }).on('error', (err) => {
    cb(err.message);
  });
}

/*
## Speaker Keys
* user_id => act_id
* speaker => name
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
      speaker: e.speaker
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

function getScheduleIndexByActId(act_id) {
  return scheduleRep.value.findIndex((element) => {
    return element.act_id === act_id;
  });
}

function getSpeakerIndexByActId(act_id) {
  return speakerRep.value.findIndex((element) => {
    return element.act_id === act_id;
  });
}

function getRoomIndexByActId(act_id) {
  return roomRep.value.findIndex((element) => {
    return element.act_id === act_id;
  });
}

function findOrCreateActSpeaker(act_id, data) {
  let index = getSpeakerIndexByActId(act_id);
  if ( index > -1 ) {
    // data from Act wins, but doesnt update name in case already modified
    speakerRep.value[index] = Object.assign({}, speakerRep.value[index], data);
  } else {
    let new_speaker = Object.assign({id: uuid(), name: data.speaker}, data);
    speakerRep.value.push(new_speaker);
  }
}

function findOrCreateActRoom(act_id, data) {
  let index = getRoomIndexByActId(act_id);
  if ( index > -1 ) {
    roomRep.value[index] = Object.assign({}, roomRep.value[index], data);
  } else {
    let new_room = Object.assign({id: uuid(), name: data.act_id}, data);
    roomRep.value.push(new_room);
  }
}

function findOrCreateActTalk(act_id, data) {
  const index      = getScheduleIndexByActId(act_id);
  const spk_index  = getSpeakerIndexByActId(data.speaker_id);
  const room_index = getRoomIndexByActId(data.room);

  if ( spk_index > -1 ) { data.speaker_id = speakerRep.value[spk_index].id }
  else { delete data.speaker_id }

  if ( room_index > -1 ) { data.room_id = roomRep.value[room_index].id }
  else { delete data.room_id }

  let start_time;
  let end_time;
  if ( data.datetime !== undefined ) { start_time = moment(data.datetime, 'X') }

  if ( ( data.duration !== undefined ) && ( start_time !== undefined ) ) {
    end_time = start_time.clone();
    end_time.add(data.duration, 'minutes');
  }

  if ( start_time ) { data.start_time = start_time.toISOString() }
  if ( end_time ) { data.end_time = end_time.toISOString() }

  if ( index > -1 ) {
    scheduleRep.value[index] = Object.assign({}, scheduleRep.value[index], data);
  } else {
    let new_schedule = Object.assign({
      id: uuid()
    }, data);
    scheduleRep.value.push(new_schedule);
  }
}
