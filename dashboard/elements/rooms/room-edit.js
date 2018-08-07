class TpcigRoomEditor extends Polymer.MutableData(Polymer.Element) {
  static get is() { return 'room-edit' }

  static get properties() {
    return {
      name: String,
      room_id: String,
      act_id: String
    };
  }

  loadRoom(room) {
    this.name = room.name;
    this.room_id = room.id;
    this.act_id = room.act_id;
  }

  saveRoom() {
    let room = {
      name: this.name,
      id: this.room_id
    };

    if ( !room.id ) {
      nodecg.sendMessage('roomCreate', room, (err, msg) => {
        this.closest('paper-dialog').close();
      });
    } else {
      nodecg.sendMessage('roomUpdate', room, (err, msg) => {
        this.closest('paper-dialog').close();
      });
    }
  }
}

customElements.define(TpcigRoomEditor.is, TpcigRoomEditor);
