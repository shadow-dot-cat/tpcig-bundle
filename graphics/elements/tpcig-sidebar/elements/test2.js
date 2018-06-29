(() => {
  class TestTwo extends Polymer.Element {
    static get is() { return "test-two" }
  }
  customElements.define(TestTwo.is, TestTwo);
})();
