(() => {
  class TpcigSidebarRoomName extends Polymer.Element {
    static get is() { return "tpcig-sidebar-room-name" }
    static get properties() {
      return {
        name: String
      };
    }
  }
  customElements.define(TpcigSidebarRoomName.is, TpcigSidebarRoomName);
})();
