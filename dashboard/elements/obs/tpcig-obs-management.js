(function() {
  'use strict';

  const obsInstanceRep = nodecg.Replicant('obsInstance');
  const obsConnectionRep = nodecg.Replicant('obsConnection');
  const roomRep = nodecg.Replicant('room');

  class TpcigRoomManagement extends Polymer.MutableData(Polymer.Element) {
    static get is() { return 'tpcig-obs-management' }

    static get properties() {
      return {
        obss: Array,
        obsCons: Array
      };
    }

    ready() {
      super.ready();

      obsInstanceRep.on('change', newVal => {
        console.log(newVal);
        let keys = Object.keys(newVal);
        this.$.empty.style.display = keys.length > 0 ? 'none' : 'flex';
        let obss = [];
        keys.forEach(element => {
          let obs = {
            ip: element
          };
          if ( typeof(newVal[element]) !== 'string') {
            obs = Object.assign({}, obs, newVal[element]);
          }
          obss.push(obs)
        })
        this.obss = obss;
      });

      obsConnectionRep.on('change', newVal => {
        this.obsCons = newVal;
      });
    }

    updateObs(item) {
      const editor = this.$.editor;
      editor.loadObs(item.model.obs);
      this.$.editRoom.open();
    }

    editStream(item) {
      const editor = this.$.connEdit;
      editor.loadConn(item.model.stream);
      this.$.editStream.open();
    }

    getRoomName(id) {
      const room = roomRep.value.find(e => id === e.id);
      if ( room === undefined ) { return ''; }
      return room.name;
    }

    showConnect(item) {
      if ( item
        && item.room_id !== undefined
        && item.room_id !== ''
        && obsInstanceRep.value[item.ip] !== undefined
      ) {
        return true;
      }
      return false;
    }

    connectStream(item) {
      nodecg.sendMessage('obsInstanceConnect', {stream: item.model.stream.stream, ip: item.model.stream.ip }, (err, data) => {
        console.log(err,data);
      });
    }

    disconnectStream(item) {
      nodecg.sendMessage('obsInstanceDisconnect', item.model.stream.stream, (err, data) => {
        console.log(err,data);
      });
    }
  }
  customElements.define(TpcigRoomManagement.is, TpcigRoomManagement);
})();
