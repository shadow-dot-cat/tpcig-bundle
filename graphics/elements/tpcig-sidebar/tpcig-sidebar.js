const obsInstanceRep = nodecg.Replicant('obsInstance');
const roomRep = nodecg.Replicant('room');
const currentRep = nodecg.Replicant('currentTalks');

class TpcigSidebar extends Polymer.Element {
  static get is() { return "tpcig-sidebar" }
  static get properties() {
    return {
      myIp: String,
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

    // Update the OBS info as needed
    obsInstanceRep.on('change', newVal => {
      // If we have an IP and this instance has been configured, set room id.
      if ( this.myIp ) {
        if ( typeof(newVal[this.myIp]) !== 'string' ) {
          this.roomId = newVal[this.myIp].room_id;
        } else {
          this.roomId = '';
        }
      }
    });

    // Update things when roomRep is changed eg. name
    roomRep.on('change', newVal => {
      if (this.roomId !== '') {
        this._updateRoom(this.roomId);
      }
    });
  }

  // Update the IP address on connection
  _updateIdentity(newVal, oldVal) {
    console.log('Updating Identity', newVal);
    if ( newVal.ip ) {
      this.myIp = newVal.ip;
      this.headerText = 'IP Address: ' + this.myIp;
    } else {
      this.headerText = 'No IP Address Received!';
    }
    if ( newVal.room_id ) {
      this.roomId = newVal.room_id;
    }
  }

  // If the room ID is changed, update the name of the room as needed
  _updateRoom(newVal, oldVal) {
    console.log('Updating Room', newVal, oldVal);
    if( newVal !== '' ) {
      console.log(newVal);
      nodecg.sendMessage('roomRead', newVal, (err, data) => {
        console.log(err, data);
        this.roomName = data.name;
      });
    }
  }
}
customElements.define(TpcigSidebar.is, TpcigSidebar);
