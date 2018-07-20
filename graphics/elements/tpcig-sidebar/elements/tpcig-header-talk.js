(() => {
  class TpcigHeaderTalk extends Polymer.Element {
    static get is() { return "tpcig-header-talk" }
    static get properties() {
      return {
        talk: String,
        speaker: String,
        twitter: String,
        website: String
      };
    }
  }
  customElements.define(TpcigHeaderTalk.is, TpcigHeaderTalk);
})();
