(() => {

  class TpcigRoomStatus extends Polymer.Element {
    static get is() { return 'tpcig-room-status' }

    static get properties() {
      return {
        activeRoom: {
          type: Object,
          observer: '_logChange'
        },
      };
    }

    ready() {
      super.ready();
    }

    _logChange(newValue) {
      console.log(newValue);
    }
  }

  customElements.define(TpcigRoomStatus.is, TpcigRoomStatus);
})();
