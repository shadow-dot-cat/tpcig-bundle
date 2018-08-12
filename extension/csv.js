'use strict';

const moment =require('moment');
const uuid = require('uuid/v4');
const http = require('https');
const url = require('url');

const nodecg = require('./util/nodecg-api-context').get();

const roomRep = nodecg.Replicant('room');
const scheduleRep = nodecg.Replicant('schedule');
const speakerRep = nodecg.Replicant('speaker');
const eventRep = nodecg.Replicant('event');

nodecg.listenFor('refreshActData', (data, cb) => {
  getActData(data, cb);
});

nodecg.listenFor('refreshActEvents', (data, cb) => {
  getActEvents(data, cb);
});

function getActData(data, cb) {
  const apiTalkUrl = url.format({
    protocol: 'https',
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

function getActEvents(data, cb) {
  const apiTalkUrl = url.format({
    protocol: 'https',
    hostname: 'act.perlconference.org',
    pathname: '/tpc-2018-glasgow/api/get_events',
    query: {
      api_key: nodecg.bundleConfig.actApiKey,
      fields: 'title,room,datetime,event_id'
    }
  });
  http.get(apiTalkUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      parseEvents(cb, JSON.parse(data));
    });
  }).on('error', (err) => {
    cb(err.message);
  });
}

function parseEvents(cb, data) {
  data.forEach((e) => {
    findOrCreateActRoom(e.room, {
      act_id: e.room
    });
    findOrCreateActEvent(e.event_id, {
      act_id: e.event_id,
      room_id: e.room,
      datetime: e.datetime,
      title: e.title
    });
  })
  cb( null, data );
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

function getEventIndexByActId(act_id) {
  return eventRep.value.findIndex((element) => {
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
  if ( act_id === undefined || act_id === '' ) {
    // dont bother with an empty act ID room - those will be custom by us anyway
    return -1;
  }
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
  const room_index = getRoomIndexByActId(data.room_id);

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

function findOrCreateActEvent(act_id, data) {
  const index = getEventIndexByActId(act_id);
  const room_index = getRoomIndexByActId(data.room_id);

  if ( room_index > -1 ) { data.room_id = roomRep.value[room_index].id }
  else { delete data.room_id }

  let start_time;
  if ( data.datetime !== undefined ) { start_time = moment(data.datetime, 'X') }

  if ( start_time ) { data.start_time = start_time.toISOString() }
  if ( index > -1 ) {
    eventRep.value[index] = Object.assign({}, eventRep.value[index], data);
  } else {
    let new_event = Object.assign({
      id: uuid()
    }, data);
    eventRep.value.push(new_event);
  }
}
