(() => {

  class TpcigStreamTechDashboard extends Polymer.Element {
    static get is() { return 'tpcig-stream-tech-dashboard' }

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

  customElements.define(TpcigStreamTechDashboard.is, TpcigStreamTechDashboard);
})();
