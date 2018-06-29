(() => {
  class TestThree extends Polymer.Element {
    static get is() { return "test-three" }
  }
  customElements.define(TestThree.is, TestThree);
})();
