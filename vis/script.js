
var App = function() {
  this.oildata = null;
};


App.prototype = {
  init: function() {
    this.loadData();
    this.initGraph();
  },
  initGraph: function() {

  },
  loadData() {
    d3.csv('data/oil.csv', function(data) {
      this.oildata = data;
    }.bind(this));
  }
};


window.onload = function() {
  var app = new App();
  app.init();
};