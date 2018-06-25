(function() {
  'use strict';

  const speakerRep = nodecg.Replicant('speaker');

  class TpcigSpeakerManagement extends Polymer.MutableData(Polymer.Element) {
    static get is() { return 'tpcig-speaker-management' }

    static get properties() {
      return {
        speakers: Array
      };
    }

    ready() {
      super.ready();

      speakerRep.on('change', newVal => {
        this.$.empty.style.display = newVal.length > 0 ? 'none' : 'flex';
        this.speakers = newVal;
      });
    }

    createSpeaker() {
      const editor = this.$.editor;
      editor.title = "Create new Speaker";
      editor.loadSpeaker({});
      this.$.editSpeaker.open();
    }

    updateSpeaker(item) {
      const editor = this.$.editor;
      console.log(item);
      editor.loadSpeaker(item.model.speaker);
      this.$.editSpeaker.open();
    }
  }
  customElements.define(TpcigSpeakerManagement.is, TpcigSpeakerManagement);
})();
