'use strict';

const express = require('express');
const app = express();

const nodecg = require('./util/nodecg-api-context').get();
const obsInstanceRep = nodecg.Replicant('obsInstance');

const OBSUtility = require('nodecg-utility-obs');
const obs = new OBSUtility(nodecg);

app.get('/obs-register', (req, res) => {
  let message = '';
  if ( obsInstanceRep.value[req.ip] === undefined ) {
    obsInstanceRep.value[req.ip] = 'new_instance';
    message = 'New OBS Instance Created';
  } else if ( typeof obsInstanceRep.value[req.ip] === 'string' ) {
    message = 'OBS Instance Not Set Up';
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
* username
* password
* room_id
*/
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
