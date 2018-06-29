const obsInstanceRep = nodecg.Replicant('obsInstance');

class TpcigObsEditor extends Polymer.MutableData(Polymer.Element) {
  static get is() { return 'obs-edit' }

  static get properties() {
    return {
      room_id:  String,
      obs_id:   String,
      password: String,
      rooms:    Array
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
  }

  saveObs() {
    let obs = {
      room_id: this.room_id,
      password: this.password
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
