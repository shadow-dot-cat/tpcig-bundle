'use strict';

const express = require('express');
const app = express();

const nodecg = require('./util/nodecg-api-context').get();
const obsInstanceRep = nodecg.Replicant('obsInstance');
const obsConnectionRep = nodecg.Replicant('obsConnection');

const OBSUtility = require('nodecg-utility-obs');

const streams = ['stream1', 'stream2', 'stream3'];

let obs = {};

for( const idx in streams ) {
  const stream_name = streams[idx];
  obs[stream_name] = new OBSUtility(nodecg, {namespace: stream_name});

  let room_idx = obsConnectionRep.value.findIndex((e) => {
    return e.stream === stream_name
  });

  if ( room_idx < 0 ) {
    obsConnectionRep.value.push({stream: stream_name, ip: null, room_id: null});
  }
}

app.get('/obs-register', (req, res) => {
  let message = '';
  let instance = obsInstanceRep.value[req.ip];
  if ( instance === undefined ) {
    obsInstanceRep.value[req.ip] = {
      ip: req.ip,
      password: null,
      room_id: null,
      is_configured: false,
      is_obs: false
    };
    message = 'New OBS Instance Created';
  } else {
    message = 'Got OBS Information';
  }
  res.json({ message: message, ip: req.ip});
});

app.get('/obs-remove', (req, res) => {
  if ( obsInstanceRep.value[req.ip] !== undefined ) {
    delete obsInstanceRep.value[req.ip];
  }
  res.send({ message: 'OBS Instance Removed'});
});

nodecg.mount(app);

/*
Data should be:

* ip
* password
* room_id
* is_configured => default false
* is_obs => default false
*/
nodecg.listenFor('obsInstanceRead', (data, cb) => {
  nodecg.log.info('Reading Instance Info', data);
  cb(null, obsInstanceRep.value[data]);
});

nodecg.listenFor('obsInstanceDelete', (data, cb) => {
  nodecg.log.info('Deleting OBS Instance', data);
  delete obsInstanceRep.value[data];
  cb(null, true);
});

nodecg.listenFor('setObsRoom', (data, cb) => {
  nodecg.log.info('Setting OBS Instance Room');
  if ( obsInstanceRep.value[data.ip] !== undefined ) {
    obsInstanceRep.value[data.ip] = data;
    cb(null, true);
  } else {
    cb('No OBS Instance');
  }
});

nodecg.listenFor('obsInstanceConnect', (data, cb) => {
  if ( !data || !data.ip || !data.stream ) {
    cb('bad arguments');
    return;
  }
  let this_instance = obsInstanceRep.value[data.ip];
  if ( this_instance === undefined ) {
    cb('no known OBS instance');
    return;
  }

  nodecg.log.info(`Setting ${data.stream} to ${data.ip}`);
  if ( isObsConnected(data.stream) ) {
    cb('Not reconnecting to already connected instance');
  } else {
    nodecg.sendMessage(`${data.stream}:connect`, {
      ip: data.ip,
      port: 4444,
      password: this_instance.password
    }, (err,data) => {
      if (err) {
        nodecg.log.info('Error connecting');
        cb('failed to connect to OBS Instance');
        return;
      }
      nodecg.log.info('Connected');
      cb(null, true);
    });
  }
});

function isObsConnected(stream_name) {
  if ( obs[stream_name].replicants.websocket.value.status === 'connected' ) {
    return true;
  }
  return false;
}

nodecg.listenFor('obsInstanceDisconnect', (data, cb) => {
  if ( obs[data] && isObsConnected(data) ) {
    nodecg.sendMessage(`${data}:disconnect`);
    cb(null, true);
  } else {
    cb('No OBS or not connected');
  }
});

nodecg.listenFor('obsGetConnectedIp', (data, cb) => {
  cb(null, getObsIp(data));
});

function getObsIp(data) {
  if ( obs[data] && isObsConnected(data) ) {
    return obs[data].websocket.value.ip;
  } else {
    return null;
  }
};

nodecg.listenFor('obsInstanceChangeScene', (data, cb) => {
  if ( data && data.obs && data.scene ) {
    if ( !isObsConnected(data.obs) ) {
      cb('OBS Not Connected');
    }
    nodecg.log.info(`Changing scene on obs ${data.obs} to ${data.scene}`);
    obs[data].setCurrentScene({'scene-name': data.scene});
  } else {
    cb('Incorrect Arguments');
  }
});
// TODO Automatically attach OBS Instance or allow for putting in user/pass from the OBS machine itself
