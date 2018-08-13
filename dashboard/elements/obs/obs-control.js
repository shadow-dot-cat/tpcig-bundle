(() => {
  const obsConnectionRep = nodecg.Replicant('obsConnection');

  class ObsControl extends Polymer.Element {
    static get is() { return 'obs-control' }

    static get properties() {
      return {
        activeRoom: {
          type: Object,
          observer: '_roomChanged',
          value: () => { return { name: 'No Room Selected', id: null } },
        },
        obsConn: Object,
        hasConn: {
          type: Boolean,
          value: false
        }
      };
    }

    ready() {
      super.ready();

      obsConnectionRep.on('change', newVal => {
        if ( this.activeRoom.id === undefined
          || this.activeRoom.id === ''
        ) { this.hasConn = false; return; }
        this.obsConn = newVal.find(e => this.activeRoom.id === e.room_id);
        this.hasConn = this.obsConn === undefined ? false : true;
      });
    }

    showSpeakerNoSlides()   { this.showScene('Speaker No Slides'); }
    showSpeakerWithSlides() { this.showScene('Speaker With Slides'); }
    showSlidesNoSpeaker()   { this.showScene('Slides No Speaker'); }
    showSlidesWithSpeaker() { this.showScene('Slides With Speaker'); }

    showScene(name) {
      if( !this.hasConn ) { return };
      nodecg.sendMessage('obsInstanceChangeScene', {obs: this.obsConn.stream, scene: name}, (err, data) => {
        console.log(err,data);
      })
    }

    _roomChanged(data) {
      if ( data.id === undefined
        || data.id === ''
      ) { this.hasConn = false; return; }
      this.obsConn = obsConnectionRep.value.find(e => data.id === e.room_id);
      this.hasConn = this.obsConn === undefined ? false : true;
    }
  }
  customElements.define(ObsControl.is, ObsControl);
})();
