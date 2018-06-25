class RoomItem extends Polymer.Element {
  static get is() { return 'room-item' }

  static get properties() {
    return {
      value: Object
    };
  }
}

customElements.define(RoomItem.is, RoomItem);
