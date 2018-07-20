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

      this.filter = true;
      scheduleRep.on('change', newVal => {
        this.schedules = newVal;
      });
    }

    setCurrent(item) {
      const schedule = item.model.schedule;
      nodecg.sendMessage('currentTalkSet', {
        room_id: schedule.room_id,
        schedule_id: schedule.id
      }, (err, msg) => {
      });
    }

    toggleFilter() {
      this.filter = !this.filter;
      this.$.scheduleList.render();
    }

    setBreak() {
      nodecg.sendMessage('currentTalkSet', {
        room_id: this.activeRoom.id,
        schedule_id: 'break'
      }, (err, msg) => {
      });
    }

    _roomChanged(newVal) {
      this.$.scheduleList.render();
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
        return this._isToday(true, item);
      }
      console.log('no room match');
      return false;
    }

    _isToday(prev, item) {
      console.log(item);
      if ( !this.filter ) {
        return prev;
      }
      if( !item.start_time ) {
        return prev;
      }
      if ( moment().isSame(item.start_time, 'day') ) {
        return prev;
      }
      return false;
    }

  }
  customElements.define(RoomSchedule.is, RoomSchedule);
})();
