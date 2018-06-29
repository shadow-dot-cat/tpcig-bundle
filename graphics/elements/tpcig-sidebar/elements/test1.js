(() => {
  class TestOne extends Polymer.Element {
    static get is() { return "test-one" }
  }
  customElements.define(TestOne.is, TestOne);
})();
