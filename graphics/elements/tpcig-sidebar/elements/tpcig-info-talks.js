(() => {
  const scheduleRep = nodecg.Replicant('schedule');
  const speakerRep = nodecg.Replicant('speaker');
  const currentRep = nodecg.Replicant('currentTalks');

  class TpcigInfoTalks extends Polymer.Element {
    static get is() { return "tpcig-info-talks" }
    static get properties() {
      return {
        roomId: {
          type: String,
          observer: '_updateTalkList'
        },
        schedules: Array,
        speakers: Array,
        scheduleId: String,
        talkList: Array,
      };
    }

    ready() {
      super.ready();

      this.schedules = [];

      scheduleRep.on('change', newVal => {
        this.schedules = newVal;
        this._updateTalkList();
      });

      speakerRep.on('change', newVal => {
        this.speakers = newVal;
        this._updateTalkList();
      });

      currentRep.on('change', newVal => {
        this.scheduleId = newVal[this.roomId];
        this._updateTalkList();
      });

      setInterval(() => {this._updateTalkList()}, 600000);
    }

    _updateTalkList() {
      //get next three talks based on start time (but from today)
      const today = moment('2018-08-15 12:40');

      // Filter for just the talks we care about
      let talkArray = this.schedules.filter(
        talk => talk.room_id === this.roomId
                && today.isSame(talk.start_time, 'day')
                && moment(talk.start_time).isAfter(today)
      );

      talkArray.sort( (a,b) => moment(a.start_time).diff(moment(b.start_time)) );

      this.talkList = talkArray.slice(0,3);
    }

    getSpeakerName(id) {
      const spk = this.speakers.find(item => item.id === id);
      return spk.name;
    }

    formatTime(ts) {
      return moment(ts).format('LT');
    }
  }
  customElements.define(TpcigInfoTalks.is, TpcigInfoTalks);
})();
