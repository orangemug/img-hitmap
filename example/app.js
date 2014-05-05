var Hitmap = require("../");

var el = document.querySelector(".demo-image");
var config = {
  "#66ff00": {id: "1", size: "TBC"},
  "#00eaff": {id: "2", size: "TBC"},
  "#00b4ff": {id: "3", size: "TBC"},
  "#005aff": {id: "4", size: "TBC"},
  "#d800ff": {id: "5", size: "TBC"},
  "#1200ff": {id: "6", size: "TBC"},
  "#c35a9d": {id: "7", size: "TBC"},
  "#ae5ac3": {id: "8", size: "TBC"},
  "#ff0000": {id: "9", size: "TBC"},
  "#c35a95": {id: "10", size: "TBC"},
  "#1200ff": {id: "11", size: "TBC"},
  "#ff0084": {id: "12", size: "TBC"},
  "#c35ab3": {id: "13", size: "TBC"},
  "#c25ac3": {id: "14", size: "TBC"},
  "#95dac3": {id: "15", size: "TBC"},
  "#91771c": {id: "16", size: "TBC"},
  "#52743b": {id: "17", size: "TBC"},
  "#2d1563": {id: "18", size: "TBC"},
  "#825ac3": {id: "19", size: "TBC"},
  "#695ac3": {id: "20", size: "TBC"},
  "#5a70c3": {id: "21", size: "TBC"},
  "#5a8cc3": {id: "22", size: "TBC"},
  "#5ac3bd": {id: "23", size: "TBC"},
  "#ff9c00": {id: "24", size: "TBC"},
  "#5ac3a7": {id: "25", size: "TBC"},
  "#ff5a00": {id: "26", size: "TBC"},
  "#e4ff00": {id: "27", size: "TBC"},
  "#ffe400": {id: "28", size: "TBC"},
  "#5ac3a7": {id: "29", size: "TBC"},
  "#ff3000": {id: "30", size: "TBC"},
  "#5ac36e": {id: "31", size: "TBC"},
  "#9f7a7a": {id: "32", size: "TBC"}
};
var events = [
  "mousemove",
  "touchmove"
]

Hitmap.create(el, "/example/assets/maldives_labels.png", config, events, function(err, instance) {
  // instance.debug(true);
});

var idEl = document.querySelector(".asset-id");
var sizeEl = document.querySelector(".asset-size");

for(var i=0; i<33; i++) {
  el.addEventListener("hitmap:"+i, function(e) {
    console.log("hitmap", e.detail.id);
    idEl.innerHTML = e.detail.id;
    sizeEl.innerHTML = e.detail.size;
  });
}

