var assert = require("assert");
var sinon = require("sinon");

require("customevent-polyfill");

var Hitmap = require("../");

// HACK
function click(el, x, y){
  var evt = new CustomEvent("click");
  evt.offsetX = x;
  evt.offsetY = y;
  el.dispatchEvent(evt);
}


describe("img-hitmap", function() {
  var config = {
    "#66ff00": "1"
  };

  var events = ["click"];

  beforeEach(function(done) {
    this.el = document.createElement("img");
    this.el.onload = function() {
      done();
    }
    this.el.src = "example/assets/maldives.png";
    document.body.appendChild(this.el);
  });

  it("should instantiate correctly", function(done) {
    var spy = sinon.spy();
    Hitmap.create(this.el, "example/assets/maldives_labels.png", config, events, function(err) {
      assert.equal(err, undefined);
      done();
    });
  });

  it("should fire DOM event when active area clicked", function(done) {
    var el = this.el;
    var spy = sinon.spy();

    Hitmap.create(this.el, "example/assets/maldives_labels.png", config, events, function() {
      el.addEventListener("hitmap:1", spy);
      process.nextTick(function() {
        assert(spy.called);
        done();
      });
      click(el, 120, 288);
    });
  });

  it("should not fire DOM event with inactive area clicked", function(done) {
    var spy = sinon.spy();
    var el = this.el;

    Hitmap.create(el, "example/assets/maldives_labels.png", config, events, function() {
      el.addEventListener("hitmap:1", spy);
      process.nextTick(function() {
        assert(!spy.called);
        done();
      });
      click(el, 20, 20);
    });
  });

  it("should fire DOM event when active area clicked when scaled", function(done) {
    var spy = sinon.spy();
    var el = this.el;

    Hitmap.create(el, "example/assets/maldives_labels.png", config, events, function() {
      el.addEventListener("hitmap:1", spy);
      process.nextTick(function() {
        assert(spy.called);
        done();
      });

      // Scale by 50%;
      el.width = 913;
      click(el, 60, 144);
    });
  });

  it("should not fire DOM event when inactive area clicked when scaled", function(done) {
    var spy = sinon.spy();
    var el = this.el;

    Hitmap.create(el, "example/assets/maldives_labels.png", config, events, function() {
      el.addEventListener("hitmap:1", spy);
      process.nextTick(function() {
        assert(!spy.called);
        done();
      });

      el.width = 913;
      click(el, 10, 10);
    });
  });

  it("should not respond to click events once destroyed", function(done) {
    var spy = sinon.spy();
    var el = this.el;

    Hitmap.create(el, "example/assets/maldives_labels.png", config, events, function() {
      var ret = Hitmap.destroy(el);
      el.addEventListener("hitmap:1", spy);

      process.nextTick(function() {
        assert(!spy.called);
        done();
      });
      click(el, 120, 288);
    });
  });

});
