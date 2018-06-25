const speakerRep = nodecg.Replicant('speaker');
const roomRep = nodecg.Replicant('room');

class TpcigScheduleEditor extends Polymer.MutableData(Polymer.Element) {
  static get is() { return 'schedule-edit' }

  static get properties() {
    return {
      schedule_title: String,
      speaker_id:     String,
      room_id:        String,
      schedule_id:    String,
      start_time:     String,
      end_time:       String,
      speakers:       Array,
      rooms:          Array
    };
  }

  ready() {
    super.ready();

    speakerRep.on('change', newVal => {
      this.speakers = newVal;
    });
    roomRep.on('change', newVal => {
      this.rooms = newVal;
    });
  }

  loadSchedule(schedule) {
    this.schedule_title = schedule.title;
    this.speaker_id     = schedule.speaker_id;
    this.room_id        = schedule.room_id;
    this.schedule_id    = schedule.id;
    this.start_time     = schedule.start_time;
    this.end_time       = schedule.end_time;
  }

  saveSchedule() {
    let schedule = {
      title:      this.schedule_title,
      speaker_id: this.speaker_id,
      room_id:    this.room_id,
      id:         this.schedule_id,
      start_time: this.start_time,
      end_time:   this.end_time
    };

    if ( !schedule.id ) {
      nodecg.sendMessage('scheduleCreate', schedule, (err, msg) => {
        this.closest('paper-dialog').close();
      });
    } else {
      nodecg.sendMessage('scheduleUpdate', schedule, (err, msg) => {
        this.closest('paper-dialog').close();
      });
    }
  }

  deleteSchedule() {
    if ( this.schedule_id ) {
      nodecg.sendMessage('scheduleDelete', this.schedule_id, (err, msg) => {
        this.closest('paper-dialog').close();
      });
    }
  }
}

customElements.define(TpcigScheduleEditor.is, TpcigScheduleEditor);
