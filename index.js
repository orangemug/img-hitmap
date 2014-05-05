var Hitmap = require("./lib/hitmap");

// Unique ref
var uid = 0;

// The list of elements bound
var els = {};

function getId(el) {
  return el.getAttribute("data-hitmap-uid");
}

function create(el, map, config, events, done) {
  var id = getId(el);
  if (id) {
    // We can't ever create more than on instance at a time so destroy.
    destroy(el);
  }

  id = uid++;
  el.setAttribute("data-hitmap-uid", id);

  /**
   * @see Hitmap#new
   */
  Hitmap.create(el, map, config, events, function(err, instance) {
    if (err) {
      if (done) done(err);
    } else {
      els[id] = instance;
      if (done) done(err, instance);
    }
  });
}

function get(el) {
  var id = getId(el);
  if (id) {
    return els[id];
  }
}

/**
 * Destroy an existing map on a image element
 * @param {Element} el element which to destroy the map
 * @return {boolean} whether there was a map to destroy
 */
function destroy(el) {
  var id = el.getAttribute("data-hitmap-uid");
  var el = els[id];
  if (!el) {
    return false;
  } else {
    el.destroy();
    delete els[id];
    return true;
  }
}

module.exports = {
  create: create,
  get: get,
  destroy: destroy
};
