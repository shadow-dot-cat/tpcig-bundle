(function() {
  'use strict';

  const scheduleRep = nodecg.Replicant('schedule');

  class TpcigScheduleManagement extends Polymer.MutableData(Polymer.Element) {
    static get is() { return 'tpcig-schedule-management' }

    static get properties() {
      return {
        schedules: Array
      };
    }

    ready() {
      super.ready();

      this.filter = true;
      scheduleRep.on('change', newVal => {
        this.$.empty.style.display = newVal.length > 0 ? 'none' : 'flex';
        this.schedules = newVal;
      });
    }

    createSchedule() {
      const editor = this.$.editor;
      editor.title = "Create new Schedule";
      editor.loadSchedule({});
      this.$.editSchedule.open();
    }

    updateSchedule(item) {
      const editor = this.$.editor;
      console.log(item);
      editor.loadSchedule(item.model.schedule);
      this.$.editSchedule.open();
    }

    refreshSchedule() {
      nodecg.sendMessage('refreshActData', (err, data) => {
        console.log('refreshed', err, data);
      });
    }

    _sortSchedules(a, b) {
      if ( !b.start_time ) {
        return -1;
      } else if ( !a.start_time ) {
        return 1;
      }
      return moment(a.start_time).diff(moment(b.start_time));
    }

    toggleFilter() {
      this.filter = !this.filter;
      console.log("toggle", this.filter);
      this.notifyPath('schedules');
    }

    _isInFuture(item) {
      if ( !this.filter ) {
        return true;
      }
      if( !item.end_time ) {
        return true;
      }
      if ( moment(item.end_time).diff(moment()) >= 0 ) {
        return true;
      }
      return false;
    }
  }
  customElements.define(TpcigScheduleManagement.is, TpcigScheduleManagement);
})();
