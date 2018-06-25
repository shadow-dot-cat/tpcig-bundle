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
  }
  customElements.define(TpcigScheduleManagement.is, TpcigScheduleManagement);
})();
