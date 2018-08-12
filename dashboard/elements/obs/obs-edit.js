(() => {
  const obsInstanceRep = nodecg.Replicant('obsInstance');

  class TpcigObsEditor extends Polymer.MutableData(Polymer.Element) {
    static get is() { return 'obs-edit' }

    static get properties() {
      return {
        title: {
          type: String,
          value: 'Edit Screen Setting',
        },
        room_id:  String,
        obs_id:   String,
        password: String,
        rooms:    Array,
        is_obs:   Boolean
      };
    }

    ready() {
      super.ready();

      roomRep.on('change', newVal => {
        this.rooms = newVal;
      });
    }

    loadObs(obs) {
      this.room_id = obs.room_id;
      this.password = obs.password;
      this.obs_id = obs.ip;
      this.is_obs = obs.is_obs;
    }

    saveObs() {
      let obs = {
        room_id: this.room_id,
        password: this.password,
        is_obs: this.is_obs
      };

      console.log(obs);
      obsInstanceRep.value[this.obs_id] = obs;
      this.closest('paper-dialog').close();
    }

    deleteObs() {
      nodecg.sendMessage('obsInstanceDelete', this.obs_id, (err, msg) => {
        this.closest('paper-dialog').close();
      })
    }
  }

  customElements.define(TpcigObsEditor.is, TpcigObsEditor);
})();
