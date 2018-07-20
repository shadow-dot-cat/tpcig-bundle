(() => {
  const roomRep = nodecg.Replicant('room');

  class RoomSelect extends Polymer.Element {
    static get is() { return 'room-select' }

    static get properties() {
      return {
        rooms: Array,
        room_id: {
          type: String,
          observer: '_roomChanged'
        },
        activeRoom: {
          type: Object,
          notify: true
        }
      };
    }

    ready() {
      super.ready();

      roomRep.on('change', newVal => {
        this.rooms = newVal;
      });
    }

    _roomChanged(newValue) {
      nodecg.sendMessage('roomRead', newValue, (err, msg) => {
        if ( !err && msg ) { this.activeRoom = msg }
      })
    }
  }
  customElements.define(RoomSelect.is, RoomSelect);
})();
