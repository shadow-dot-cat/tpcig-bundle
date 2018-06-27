(function() {
  'use strict';

  const obsInstanceRep = nodecg.Replicant('obsInstance');

  class TpcigRoomManagement extends Polymer.MutableData(Polymer.Element) {
    static get is() { return 'tpcig-obs-management' }

    static get properties() {
      return {
        obss: Array
      };
    }

    ready() {
      super.ready();

      obsInstanceRep.on('change', newVal => {
        console.log(newVal);
        let keys = Object.keys(newVal);
        this.$.empty.style.display = keys.length > 0 ? 'none' : 'flex';
        let obss = [];
        keys.forEach(element => {
          let obs = {
            ip: element
          };
          if ( typeof(newVal[element]) !== 'string') {
            obs = Object.assign({}, obs, newVal[element]);
          }
          obss.push(obs)
        })
        this.obss = obss;
      });
    }

    updateObs(item) {
      const editor = this.$.editor;
      editor.loadObs(item.model.obs);
      this.$.editRoom.open();
    }
  }
  customElements.define(TpcigRoomManagement.is, TpcigRoomManagement);
})();
