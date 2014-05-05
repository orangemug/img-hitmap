var bind = require("lodash.bind");
var imageToContext = require("image-to-context");


function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


/**
 * Create an image map on an image element
 * @param el the image element
 * @param {String|HTMLImageElement|Image} map to apply
 * @param {Object} config of colors and events to fire
 *
 *   {
 *     "#cccccc": "id_one"
 *   }
 *
 * @param {Array} events to bind to
 * @param {Function} done the callback
 */
function Hitmap(el, map, config, events, done) {
  var i, self = this;
  this.el = el;
  this.config = config;
  this.events = events;

  this._hdl = bind(this._hdl, this);

  for(i=0; i<events.length; i++) {
    el.addEventListener(events[i], this._hdl);
  }

  imageToContext(map, function(err, ctx) {
    self.mapCtx = ctx;
    if(done) done(undefined, self);
  });
}

/**
 * @alias Hitmap#new
 */
Hitmap.create = function(el, map, config, events, done) {
  return new Hitmap(el, map, config, events, done);
};

/**
 * A event handler for mouse and touch events, this will cause events to get triggered
 * @param e the event
 */
Hitmap.prototype._hdl = function(e) {
  var id, eventId;
  var data, el = e.target;

  // Scaled values
  var sx, sy, sw, sh;

  // Natural values
  var nx, ny, nw, nh;

  sx = e.offsetX;
  sy = e.offsetY;
  sw = el.width;
  sh = el.height;

  nw = el.naturalWidth;
  nh = el.naturalHeight;

  nx = (nw/sw)*sx;
  ny = (nh/sh)*sy;

  nx = Math.round(nx);
  ny = Math.round(ny);

  // Get the color at pixel position
  data = this.mapCtx.getImageData(nx, ny, 1, 1).data;
  var color = rgbToHex(data[0], data[1], data[2]);

  var eventId = this.config[color];
  if (eventId) {
    id = eventId.id || eventId;
    data = eventId;
    this._fire(id, data);
  }
};

Hitmap.prototype._fire = function(id, data) {
  var evt = new CustomEvent("hitmap:"+id, {
    detail: data
  });
  this.el.dispatchEvent(evt);
}

/**
 * Destroy an existing map on a image element
 */
Hitmap.prototype.destroy = function() {
  events = this.events;
  for(i=0; i<events.length; i++) {
    this.el.removeEventListener(events[i], this._hdl);
  }
}

/**
 *
 */
Hitmap.prototype.debug = function(val) {
  var el = this.el;
  var debugEl;

  if (this.debugEl) {
    document.body.removeChild(this.debugEl);
  }
  window.removeEventListener("resize", this.debug);

  if (val === false) {
    return;
  }

  debugEl = document.createElement("canvas");
  window.addEventListener("resize", this.debug);

  debugEl.style.position = "absolute";
  debugEl.style.top      = el.offsetTop+"px";
  debugEl.style.left     = el.offsetLeft+"px";
  debugEl.style.opacity  = "1";
  debugEl.style.pointerEvents = "none";

  debugEl.width  = el.offsetWidth;
  debugEl.height = el.offsetHeight;

  document.body.appendChild(debugEl);

  var ctx = debugEl.getContext("2d")
  ctx.drawImage(this.mapCtx.canvas, 0, 0, el.offsetWidth, el.offsetHeight);

  this.debugEl = debugEl;
}


module.exports = Hitmap;
