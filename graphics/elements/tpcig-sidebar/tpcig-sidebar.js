(() => {
  const obsInstanceRep = nodecg.Replicant('obsInstance');
  const roomRep = nodecg.Replicant('room');
  const currentRep = nodecg.Replicant('currentTalks');

  const itemArray = ['test-one', 'test-two', 'test-three'];

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
        headerText: String,
        roomId: {
          type: String,
          observer: '_updateRoom'
        },
        roomName: String,
      };
    }

    ready() {
      super.ready();

      this.isConfigured = false;
      this.headerText = 'Unconfigured Room';
      this.roomId = '';
      this.myIp = '';

      // Update the OBS info as needed
      obsInstanceRep.on('change', newVal => {
        console.log('Instance Info Change', newVal);
        // If we have an IP and this instance has been configured, set room id.
        if ( this.myIp !== '' ) {
          this._updateIp(this.myIp);
        }
      });

      // Update things when roomRep is changed eg. name
      roomRep.on('change', newVal => {
        console.log('Room Info Change', newVal);
        if (this.roomId !== '') {
          this._updateRoom(this.roomId);
        }
      });

console.log('content', this.$.content);
      setInterval(() => {this.loopArray()}, 2000);
    }

    loopArray() {
      let next = itemArray.shift();
      console.log('looping', next);
      itemArray.push(next);
      let nextElement = document.createElement(next);
      console.log('content', this.$.content);
      console.log('next Element', nextElement);
      this.$.content.innerHTML = '';
      this.$.content.appendChild(nextElement);
    }

    // Update the IP address on connection
    _updateIdentity(newVal, oldVal) {
      console.log('Updating Identity', newVal);
      if ( ! newVal ) {
        return;
      }
      if ( newVal.ip ) {
        this.myIp = newVal.ip;
        this.headerText = 'IP Address: ' + this.myIp;
      } else {
        this.headerText = 'No IP Address Received!';
      }
    }

    // If the room ID is changed, update the name of the room as needed
    _updateRoom(newVal, oldVal) {
      console.log('Updating Room', newVal);
      if ( !newVal ) {
        return;
      }
      if( newVal !== '' ) {
        nodecg.sendMessage('roomRead', newVal, (err, data) => {
          this.roomName = data.name;
        });
      }
    }

    _updateIp(newVal, oldVal) {
      console.log('Updating Ip', newVal);
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
