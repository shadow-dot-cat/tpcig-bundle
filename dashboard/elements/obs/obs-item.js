class ObsItem extends Polymer.Element {
  static get is() { return 'obs-item' }

  static get properties() {
    return {
      value: {
        type: Object,
        observer: '_updateRoom'
      }
    };
  }

  ready() {
    super.ready();
    this._updateRoom(true);
  }
  // get room name
  _updateRoom(newVal, oldVal) {
    if (newVal) {
      nodecg.sendMessage('roomRead', this.value.room_id, (err, data) => {
        if (data) {
          this.room = data.name;
        }
      });
    }
  }
}

customElements.define(ObsItem.is, ObsItem);
