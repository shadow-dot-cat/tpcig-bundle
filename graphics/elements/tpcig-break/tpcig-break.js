(() => {
  const roomRep = nodecg.Replicant('room');
  const eventRep = nodecg.Replicant('event');
  const speakerRep = nodecg.Replicant('speaker');
  const scheduleRep = nodecg.Replicant('schedule');

  class TpcigBreak extends Polymer.Element {
    static get is() { return "tpcig-break" }
    static get properties() {
      return {
        rooms: Array,
        display: Array,
        events: Array,
        schedules: Array,
        today: Object
      };
    }
    ready() {
      super.ready();

      this.today = moment('2018-08-15').startOf('day');
      this.display = [];
      this.rooms = [];
      this._rooms = [];
      this.events = [];
      this._events = [];
      this.schedules = [];
      this._schedules = [];
      this._speakers = [];
      this._roomLookup = {};

      speakerRep.on('change', newVal => {
        this._speakers = newVal;
        this._updateAll();
      });

      roomRep.on('change', newVal => {
        this._rooms = newVal;
        this._updateAll();
      });

      eventRep.on('change', newVal => {
        this._events = newVal;
        this._updateAll();
      });

      scheduleRep.on('change', newVal => {
        this._schedules = newVal;
        this._updateAll();
      });
    }

    _updateAll() {
      this._updateRooms();
      this._updateEvents();
      this._updateSchedules();
    }

    _updateRooms() {
      let newRooms = [];
      this._rooms.forEach((e) => {
        this._roomLookup[e.id] = {
          show: e.schedule_show,
          room_id: e.room_id,
          act_id: e.act_id
        };
        // Always show the venue
        if ( e.act_id === 'venue' ) { this._roomLookup[e.id].show = true };
        if ( e.schedule_show ) {
          newRooms.push(e);
        }
      });
      // Sort based on act id (which is alphanumerical)
      newRooms.sort((a,b) => { return a.act_id.localeCompare(b.act_id) })
      this.rooms = newRooms;
      this._buildDisplay();
    }

    _updateEvents() {
      let newEvents = {};
      // TODO limit to today only and sort
      this._events.forEach((e) => {
        // skip events not in a wanted room
        if ( ! this._roomLookup[e.room_id].show ) { return };
        let event_moment = moment(e.datetime, 'X');
        if ( event_moment.isBefore(this.today) ) { return }
        if ( event_moment.isAfter(this.today.clone().add(1, 'd')) ) { return }
        let new_event = {
          is_event: true,
          title: e.title,
          datetime: e.datetime,
          time: moment(e.datetime, 'X').format('LT'),
          data: e
        };
        // only ever one event at each datetime
        newEvents[e.datetime] = new_event;
      });

      let eventVals = Object.values(newEvents);
      eventVals.sort((a,b) => { return a.datetime - b.datetime });
      this.events = eventVals;
      this._buildDisplay();
    }

    _updateSchedules() {
      let newSchedule = {};
      this._schedules.forEach((e) => {
        if ( this._roomLookup[e.room_id] === undefined ) { return }
        if ( ! this._roomLookup[e.room_id].show ) { return }
        let event_moment = moment(e.datetime, 'X');
        if ( event_moment.isBefore(this.today) ) { return }
        if ( event_moment.isAfter(this.today.clone().add(1, 'd')) ) { return }

        let new_sched = {
          is_event: false,
          data: e
        };
        new_sched.is_event = false;
        new_sched.data = e;
        if ( newSchedule[e.datetime] !== undefined ) {
          newSchedule[e.datetime].events.push(new_sched);
        } else {
          newSchedule[e.datetime] = {
            datetime: e.datetime,
            time: moment(e.datetime, 'X').format('LT'),
            is_event: false,
            events: [ new_sched ]
          };
        }
      });
      let scheduleValues = Object.values(newSchedule);
      scheduleValues.forEach((e) => {
        if (e.events.length < this.rooms.length) {
          let needed_rooms = this.rooms.map(obj => obj.id);
          e.events.forEach((r) => {
            let room_index = needed_rooms.findIndex(item => item === r.data.room_id);
            // delete the room from the needed set
            needed_rooms.splice(room_index, 1);
          })
          needed_rooms.forEach((nr) => {
            e.events.push({data: {room_id: nr}});
          })
        }
        e.events.sort((a,b) => {
          return this._roomLookup[a.data.room_id].act_id.localeCompare(this._roomLookup[b.data.room_id].act_id)
        });
      })
      this.schedules = scheduleValues;
      this._buildDisplay();
    }

    _buildDisplay() {
      let newDisplay = [];
      newDisplay.push( ...this.events );
      newDisplay.push( ...this.schedules );
      newDisplay.sort((a,b) => { return a.datetime - b.datetime });
      this.display = newDisplay;
    }

    getSpeakerName(id) {
      const spk = this._speakers.find(item => item.id === id);
      if ( !spk ) { return '' }
      return spk.name;
    }
  }
  customElements.define(TpcigBreak.is, TpcigBreak);
})();
