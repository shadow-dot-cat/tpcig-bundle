(() => {
  const obsConnectionRep = nodecg.Replicant('obsConnection');
  const obsInstanceRep = nodecg.Replicant('obsInstance');
  const roomRep = nodecg.Replicant('room');

  class TpcigConnEditor extends Polymer.MutableData(Polymer.Element) {
    static get is() { return 'obs-conn' }

    static get properties() {
      return {
        title: {
          type: String,
          value: 'Edit Stream Connection',
        },
        conn_data: Object,
        obss: Array,
        rooms: Array
      };
    }

    ready() {
      super.ready();

      obsInstanceRep.on('change', newVal => {
        this.obss = Object.keys(newVal);
      });
      roomRep.on('change', newVal => {
        this.rooms = newVal;
      });
    }

    loadConn(data) {
      console.log(data);
      this.conn_data = data;
      this.conn_idx = obsConnectionRep.value.findIndex(e => this.conn_data.stream === e.stream)
    }

    saveConn() {
      obsConnectionRep.value[this.conn_idx] = this.conn_data;
      this.closest('paper-dialog').close();
    }

    _isObs(item) {
      const instance = obsInstanceRep.value[item];
      if (instance.is_obs) {
        return true;
      }
      return false;
    }
  }

  customElements.define(TpcigConnEditor.is, TpcigConnEditor);
})();
