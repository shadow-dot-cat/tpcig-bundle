(() => {
  const currentTalksRep = nodecg.Replicant('currentTalks');
  const scheduleRep = nodecg.Replicant('schedule');

  class RoomStatus extends Polymer.Element {
    static get is() { return 'room-status' }

    static get properties() {
      return {
        activeRoom: {
          type: Object,
          observer: '_roomChanged',
          value: () => { return { name: 'No Room Selected', id: null } },
        },
        currentTalk: {
          type: Object,
          value: () => { return { title: 'Unknown', id: null } },
        },
        currentSpeaker: {
          type: Object,
          value: () => { return { name: 'Unknown', id: null } },
        },
        formatted_start: {
          type: String,
          computed: 'formatDateTime(currentTalk.start_time)'
        },
        formatted_end: {
          type: String,
          computed: 'formatDateTime(currentTalk.end_time)'
        }
      };
    }

    ready() {
      super.ready();

      currentTalksRep.on('change', newVal => {
        this.updateTalk(this.activeRoom.id, newVal);
      })
    }

    formatDateTime(time) {
      if ( time == undefined ) {
        return 'no time set';
      }
      return moment(time).format('L LT');
    }

    _roomChanged(newVal) {
      console.log('room changed', newVal);
      this.updateTalk(newVal.id, currentTalksRep.value);
    }

    updateTalk(id, newVal) {
      if ( id === null ) {
        return;
      }
      nodecg.sendMessage('scheduleRead', newVal[id], (err, msg) => {
        this.currentTalk = msg;
        nodecg.sendMessage('speakerRead', msg.speaker_id, (err, spk) => {
          this.currentSpeaker = spk;
          console.log("new Speaker", spk);
        });
        console.log("new Schedule", msg);
      });
    }
  }
  customElements.define(RoomStatus.is, RoomStatus);
})();
