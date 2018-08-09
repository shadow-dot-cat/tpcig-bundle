class TpcigRoomEditor extends Polymer.MutableData(Polymer.Element) {
  static get is() { return 'room-edit' }

  static get properties() {
    return {
      name: String,
      room_id: String,
      act_id: String,
      schedule_show: Boolean,
    };
  }

  loadRoom(room) {
    this.name = room.name;
    this.room_id = room.id;
    this.act_id = room.act_id;
    this.schedule_show = room.schedule_show;
  }

  deleteRoom() {
    if ( this.act_id !== undefined && this.act_id !== '' ) { return }
    if ( this.room_id ) {
      nodecg.sendMessage('roomDelete', this.room_id, (err, msg) => {
        this.closest('paper-dialog').close();
      });
    }
  }

  saveRoom() {
    let room = {
      name: this.name,
      id: this.room_id,
      schedule_show: this.schedule_show
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
