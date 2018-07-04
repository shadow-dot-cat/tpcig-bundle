(() => {
  class TpcigHeaderIp extends Polymer.Element {
    static get is() { return "tpcig-header-ip" }
    static get properties() {
      return {
        ip: String
      };
    }
  }
  customElements.define(TpcigHeaderIp.is, TpcigHeaderIp);
})();
