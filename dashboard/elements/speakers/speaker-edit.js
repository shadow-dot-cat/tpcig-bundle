class TpcigSpeakerEditor extends Polymer.MutableData(Polymer.Element) {
  static get is() { return 'speaker-edit' }

  static get properties() {
    return {
      name: String,
      twitter: String,
      website: String,
      speaker_id: String
    };
  }

  loadSpeaker(speaker) {
    this.name = speaker.name;
    this.twitter = speaker.twitter;
    this.website = speaker.website;
    this.speaker_id = speaker.id;
  }

  saveSpeaker() {
    let speaker = {
      name: this.name,
      twitter: this.twitter,
      website: this.website,
      id: this.speaker_id
    };

    if ( !speaker.id ) {
      nodecg.sendMessage('speakerCreate', speaker, (err, msg) => {
        this.closest('paper-dialog').close();
      });
    } else {
      nodecg.sendMessage('speakerUpdate', speaker, (err, msg) => {
        this.closest('paper-dialog').close();
      });
    }
  }
}

customElements.define(TpcigSpeakerEditor.is, TpcigSpeakerEditor);
