(() => {
  const roomRep = nodecg.Replicant('room');

  class TpcigBreak extends Polymer.Element {
    static get is() { return "tpcig-break" }
    static get properties() {
      return {
        rooms: Array,
        events: Array
      };
    }
    ready() {
      super.ready();

      roomRep.on('change', newVal => {
        this._updateRooms(newVal);
      });
    }

    _updateRooms(data) {
      let newRooms = [];
      data.forEach((e) => {
        if ( e.schedule_show ) {
          newRooms.push(e);
        }
      });
      // Sort based on act id (which is alphanumerical)
      newRooms.sort((a,b) => { return a.act_id.localeCompare(b.act_id) })
      this.rooms = newRooms;
    }
  }
  customElements.define(TpcigBreak.is, TpcigBreak);
})();
