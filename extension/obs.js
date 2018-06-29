'use strict';

const express = require('express');
const app = express();

const nodecg = require('./util/nodecg-api-context').get();
const obsInstanceRep = nodecg.Replicant('obsInstance');

const OBSUtility = require('nodecg-utility-obs');
const obs = new OBSUtility(nodecg);

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

// TODO Automatically attach OBS Instance or allow for putting in user/pass from the OBS machine itself
