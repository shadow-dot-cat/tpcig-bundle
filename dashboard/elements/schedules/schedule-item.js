class ScheduleItem extends Polymer.Element {
  static get is() { return 'schedule-item' }

  static get properties() {
    return {
      value: {
        type: Object,
        value: () => { return {
          id: String,
          title: String,
          speaker_id: String,
          room_id: String,
          start_time: String,
          end_time: String
        } },
      },
      room: Object,
      speaker: Object,
      formatted_start: {
        type: String,
        computed: 'formatDateTime(value.start_time)'
      },
      formatted_end: {
        type: String,
        computed: 'formatDateTime(value.end_time)'
      }
    };
  }

  static get observers() {
    return [
      'update(value)'
    ]
  }

  formatDateTime(time) {
    if ( time == undefined ) {
      return 'no time set';
    }
    return moment(time).format('L LT');
  }

  ready() {
    super.ready();

    this.update(this.value);
  }

  update(value) {
    nodecg.sendMessage('speakerRead', this.value.speaker_id, (err, speaker) => {
      this.speaker = speaker;
    });
    nodecg.sendMessage('roomRead', this.value.room_id, (err, room) => {
      this.room = room;
    });
  }


}

customElements.define(ScheduleItem.is, ScheduleItem);
