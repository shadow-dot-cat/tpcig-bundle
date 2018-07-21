(() => {
  const obsInstanceRep = nodecg.Replicant('obsInstance');
  const roomRep = nodecg.Replicant('room');
  const scheduleRep = nodecg.Replicant('schedule');
  const speakerRep = nodecg.Replicant('speaker');
  const currentRep = nodecg.Replicant('currentTalks');

  const infoArray = ['tpcig-info-talks'];

  class TpcigSidebar extends Polymer.Element {
    static get is() { return "tpcig-sidebar" }
    static get properties() {
      return {
        myIp: {
          type: String,
          observer: '_updateIp'
        },
        obsIdentity: {
          type: Object,
          observer: '_updateIdentity'
        },
        roomId: {
          type: String,
          observer: '_updateRoom'
        },
        roomName: String,
        scheduleId: {
          type: String,
          observer: '_showCurrentTalkHeader'
        },
      };
    }

    ready() {
      super.ready();

      this.isConfigured = false;
      this.roomId = '';
      this.myIp = '';

      this._setHeaderContent('tpcig-header-ip', {ip: 'No IP Found Yet'});

      // Update the OBS info as needed
      obsInstanceRep.on('change', newVal => {
        // If we have an IP and this instance has been configured, set room id.
        if ( this.myIp !== '' ) {
          this._updateIp(this.myIp);
        }
      });

      // Update things when roomRep is changed eg. name
      roomRep.on('change', newVal => {
        if (this.roomId !== '') {
          this._updateRoom(this.roomId);
          this.loopArray();
        }
      });

      scheduleRep.on('change', newVal => {
        if ( this.scheduleId !== null ) {
          this._showCurrentTalkHeader(this.scheduleId);
        }
      })

      speakerRep.on('change', newVal => {
        if ( this.scheduleId !== null ) {
          this._showCurrentTalkHeader(this.scheduleId);
        }
      })

      currentRep.on('change', newVal => {
        this.scheduleId = newVal[this.roomId];
        this._showCurrentTalkHeader(newVal[this.roomId]);
      })

      setInterval(() => {this.loopArray()}, 20000);
    }

    _showCurrentTalkHeader(id) {
      // If theres nothing on (its a new room or something), do nothing
      if ( id === null ) {
        return;
      }
      // If its a break, set the header of break
      if ( id === 'break' ) {
        this._setHeaderContent('tpcig-header-break');
        return;
      }
      // If its a talk, set the header as needed
      nodecg.sendMessage('scheduleRead', id, (err, sch) => {
        if ( sch === null ) {
          return;
        }
        this.scheduleId = sch.id;
        nodecg.sendMessage('speakerRead', sch.speaker_id, (err, spk) => {
          this.speakerId = spk.id;
          this._setHeaderContent('tpcig-header-talk', {
            talk: sch.title,
            speaker: spk.name,
            twitter: spk.twitter,
            website: spk.website
          });
        });
      });
    }

    loopArray() {
      let next = infoArray.shift();
      infoArray.push(next);
      let nextElement = document.createElement(next);
      nextElement.roomId = this.roomId;
      this.$.infoContent.innerHTML = '';
      this.$.infoContent.appendChild(nextElement);
    }

    _setHeaderContent(name, args) {
      let element = document.createElement(name);
      if ( args !== undefined ) {
        Object.keys(args).forEach(key => {
          element[key] = args[key];
        });
      }
      this.$.headerContent.innerHTML = '';
      this.$.headerContent.appendChild(element);
    }

    // Update the IP address on connection
    _updateIdentity(newVal, oldVal) {
      if ( ! newVal ) {
        return;
      }
      if ( newVal.ip ) {
        this.myIp = newVal.ip;
        this._setHeaderContent('tpcig-header-ip', {ip: this.myIp});
      } else {
        this._setHeaderContent('tpcig-header-ip', {ip: 'No IP Address Received!'});
      }
    }

    // If the room ID is changed, update the name of the room as needed
    _updateRoom(newVal, oldVal) {
      if ( !newVal ) {
        return;
      }
      if( newVal !== '' ) {
        nodecg.sendMessage('roomRead', newVal, (err, data) => {
          this.roomName = data.name;
          this.scheduleId == currentRep.value[data.id];
          this._showCurrentTalkHeader(currentRep.value[data.id]);
        });
      }
    }

    _updateIp(newVal, oldVal) {
      if ( !newVal ) {
        return;
      }
      if ( newVal !== '' ) {
        nodecg.sendMessage('obsInstanceRead', newVal, (err, data) => {
          if ( data !== null && typeof(data) !== 'string' ) {
            this.roomId = data.room_id;
          }
        });
      }
    }
  }
  customElements.define(TpcigSidebar.is, TpcigSidebar);
})();
