(() => {
  const scheduleRep = nodecg.Replicant('schedule');

  class RoomSchedule extends Polymer.Element {
    static get is() { return 'room-schedule' }

    static get properties() {
      return {
        activeRoom: {
          type: Object,
          observer: '_roomChanged'
        },
        schedules: Array
      };
    }

    ready() {
      super.ready();

      scheduleRep.on('change', newVal => {
        this.schedules = newVal;
      });
    }

    setCurrent(item) {
      console.log(item.model.schedule);
      const schedule = item.model.schedule;
      nodecg.sendMessage('currentTalkSet', {
        room_id: schedule.room_id,
        schedule_id: schedule.id
      }, (err, msg) => {
        console.log(err, msg);
      });
    }

    _roomChanged(newVal) {
      this.$.scheduleList.render();
      console.log(newVal);
    }

    _sortSchedules(a, b) {
      if ( !b.start_time ) {
        return -1;
      } else if ( !a.start_time ) {
        return 1;
      }
      return moment(a.start_time).diff(moment(b.start_time));
    }

    _isInRoom(item) {
      if( !item.room_id ) {
        console.log('no room id');
        return false;
      }
      if ( !this.activeRoom || !this.activeRoom.id ) {
        console.log('no active room');
        return false;
      }
      if ( item.room_id === this.activeRoom.id ) {
        console.log('room match');
        return true;
      }
      console.log('no room match');
      return false;
    }

  }
  customElements.define(RoomSchedule.is, RoomSchedule);
})();
