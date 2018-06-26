(function() {
  'use strict';

  const roomRep = nodecg.Replicant('room');

  class TpcigRoomManagement extends Polymer.MutableData(Polymer.Element) {
    static get is() { return 'tpcig-room-management' }

    static get properties() {
      return {
        rooms: Array
      };
    }

    ready() {
      super.ready();

      roomRep.on('change', newVal => {
        this.$.empty.style.display = newVal.length > 0 ? 'none' : 'flex';
        this.rooms = newVal;
      });
    }

    createRoom() {
      const editor = this.$.editor;
      editor.title = "Create new Room";
      editor.loadRoom({});
      this.$.editRoom.open();
    }

    updateRoom(item) {
      const editor = this.$.editor;
      editor.loadRoom(item.model.room);
      this.$.editRoom.open();
    }
  }
  customElements.define(TpcigRoomManagement.is, TpcigRoomManagement);
})();
