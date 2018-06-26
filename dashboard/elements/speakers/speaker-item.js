class SpeakerItem extends Polymer.Element {
  static get is() { return 'speaker-item' }

  static get properties() {
    return {
      value: {
        type: Object,
        observer: '_valueChanged'
      }
    };
  }

  _valueChanged(newValue) {
		Polymer.dom(this.$.body).innerHTML = newValue.text;
	}
}

customElements.define(SpeakerItem.is, SpeakerItem);
