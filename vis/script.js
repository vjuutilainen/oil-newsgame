'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var visPath = '/';

if (location.href.match('//yle.fi/')) {
  visPath = '//yle.fi/plus/oil/';
}

var formatDate = d3.time.format('%YM%m');
var formatDateYear = d3.time.format('%Y');

var Vis = function () {
  function Vis(options) {
    var _this = this;

    _classCallCheck(this, Vis);

    this.widthContainer = d3.select('.width_container');
    this.parentContainer = d3.select('#esi-vis .init_container');
    this.container = d3.select('.vis_container');
    this.width = this.widthContainer[0][0].getBoundingClientRect().width;
    this.height = this.width / 2;
    this.padding = 40;
    this.leftPadding = 0;
    this.priceData = null;
    this.ended = false;
    this.info = this.container.append('div').attr('class', 'info');
    this.svg = this.container.append('svg');
    this.content = this.svg.append('g').attr('class', 'content').attr('transform', 'translate(0, ' + this.padding / 2 + ')');
    this.scaleX = d3.time.scale();
    this.scaleY = d3.scale.linear();
    this.axisX = d3.svg.axis().orient('bottom').ticks(10);
    this.axisY = d3.svg.axis().orient('right').ticks(10);
    this.axisGroupX = this.content.append('g').attr('class', 'axis-x').attr('transform', 'translate(0, ' + (this.height - 40) + ')');
    this.axisGroupY = this.content.append('g').attr('class', 'axis-y');
    this.lineGenerator = d3.svg.line().interpolate('basis').defined(function (d) {
      return d.date > _this.beginTime;
    });
    this.line = null;
    this.eventMarkers = null;
    this.pastTime = formatDate.parse('1940M01');
    this.beginTime = formatDate.parse('1960M01');
    this.currentTime = formatDate.parse('1960M01');
    this.finalTime = formatDate.parse('2016M05');
    this.currentPrice = null;
    this.transactionData = [];
    this.transition = false;
    this.onEnd = options && options.onEnd ? options.onEnd : false;

    window.onresize = function () {
      _this.resizeGraph();
      _this.updateGraph();
      _this.updatetransactionMarkers();
    };
  }

  _createClass(Vis, [{
    key: 'loadData',
    value: function loadData(cb) {
      var _this2 = this;

      d3.csv(visPath + 'vis/data/oil.csv', this.transformPriceData, function (err, data) {
        if (err) throw err;
        _this2.priceData = data;
        _this2.currentPrice = data[0].price;
        d3.csv(visPath + 'vis/data/events.csv', _this2.transformEventData, function (err, data) {
          if (err) throw err;
          _this2.eventData = data;
          cb(data);
        });
      });
    }
  }, {
    key: 'initGraph',
    value: function initGraph(data) {
      this.linecontainer = this.content.append('g');
      this.line = this.linecontainer.append('path').attr('fill', 'none').attr('stroke-width', 4).attr('linecap', 'round').attr('stroke', 'white').attr('class', 'line');
    }
  }, {
    key: 'initTransactionMarkers',
    value: function initTransactionMarkers() {
      this.transactionMarkers = this.linecontainer.selectAll('.transactionmarker');
    }
  }, {
    key: 'updatetransactionMarkers',
    value: function updatetransactionMarkers() {
      var _this3 = this;

      var join = this.transactionMarkers.data(this.transactionData);
      join.exit().remove();

      join.enter().append('g').attr('class', 'transactionmarker').each(function (d) {

        d3.select(this).append('circle').attr('r', '10').attr('fill', function (d) {
          return d.type === 'BUY' ? 'rgb(255, 180, 0)' : 'rgb(0, 180, 200)';
        });

        d3.select(this).append('text').style('font-family', 'Open Sans, Arial').attr('font-size', '8px').attr('fill', 'white').attr('dx', 0).attr('text-anchor', 'middle').attr('dy', 3).text(function (d) {
          return d.price.toFixed(1);
        });
      });

      join.attr('transform', function (d) {
        var x = _this3.scaleX(d.date);
        var y = _this3.scaleY(d.price);
        return 'translate(' + x + ',' + y + ')';
      });

      this.transactionMarkers = join;
    }
  }, {
    key: 'init',
    value: function init(cb) {
      var _this4 = this;

      this.loadData(function (data) {
        _this4.initGraph();
        _this4.initTransactionMarkers();
        _this4.initInfo();
        _this4.resizeGraph();
        _this4.updateGraph();
        _this4.updatetransactionMarkers();
        if (cb) cb(_this4);
      });
    }
  }, {
    key: 'resizeGraph',
    value: function resizeGraph() {
      this.width = this.widthContainer[0][0].getBoundingClientRect().width;
      this.height = this.width / 2;
      this.innerHeight = this.height - this.padding;
      this.svg.attr('width', this.width).attr('height', this.height);
      this.axisGroupX.attr('transform', 'translate(0, ' + (this.height - 40) + ')');
    }
  }, {
    key: 'getDataCrop',
    value: function getDataCrop(data) {
      var _this5 = this;

      var leftTime = new Date(this.currentTime);
      leftTime.setFullYear(leftTime.getFullYear() - 20);

      return data.filter(function (d) {
        return d.date >= leftTime && d.date <= _this5.currentTime;
      });
    }
  }, {
    key: 'initInfo',
    value: function initInfo() {

      var html = '';
      this.info.html(html);
    }
  }, {
    key: 'updateInfo',
    value: function updateInfo() {
      var _this6 = this;

      var event = this.eventData.reduce(function (prev, curr) {
        return curr.date <= _this6.currentTime ? curr : prev;
      }, this.eventData[0]);

      var html = '<h4>' + event.date.getFullYear() + '</h4>' + '<h3>' + event.title + '</h3>';

      this.info.html(html);
    }
  }, {
    key: 'update',
    value: function update() {

      var newTime = new Date(this.currentTime);

      newTime.setDate(newTime.getDate() + 5);

      this.currentTime = newTime;
      if (this.currentTime > this.finalTime) {
        this.playing = false;
        this.currentTime = this.finalTime;
        this.initInfo();
        this.ended = true;
        if (this.onEnd) this.onEnd();
      }

      this.updateInfo();
      this.updateGraph();
      this.updatetransactionMarkers();
    }
  }, {
    key: 'play',
    value: function play() {
      var _this7 = this;

      this.playing = true;

      var tick = function tick() {
        if (_this7.playing && _this7.currentTime !== _this7.finalTime) {
          if (!_this7.transition) _this7.update();
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    }
  }, {
    key: 'restart',
    value: function restart() {
      this.ended = false;
      this.currentTime = this.beginTime;
      this.transactionData = [];
      this.updateGraph();
      this.initInfo();
      this.updatetransactionMarkers();
    }
  }, {
    key: 'buy',
    value: function buy() {
      this.addTransactionMarker('BUY');
    }
  }, {
    key: 'sell',
    value: function sell() {
      this.addTransactionMarker('SELL');
    }
  }, {
    key: 'addTransactionMarker',
    value: function addTransactionMarker(type) {
      this.transactionData.push({ type: type, date: this.currentTime, price: this.currentPrice });
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.playing = false;
      this.updateGraph();
      this.updatetransactionMarkers();
      this.updateInfo();
    }
  }, {
    key: 'getCurrentPrice',
    value: function getCurrentPrice() {
      return this.currentPrice;
    }
  }, {
    key: 'getCurrentYear',
    value: function getCurrentYear() {
      return this.currentTime;
    }
  }, {
    key: 'updateGraph',
    value: function updateGraph() {
      var _this8 = this;

      var data = this.ended ? this.priceData.filter(function (d) {
        return d.date >= _this8.beginTime;
      }) : this.getDataCrop(this.priceData);
      this.currentPrice = data[data.length - 1].price;
      var xExtent = d3.extent(data, function (d) {
        return d.date;
      });
      var yExtent = d3.extent(data, function (d) {
        return d.price;
      });
      this.scaleX.domain(xExtent);
      this.scaleY.domain([0, yExtent[1]]);
      this.scaleX.range([0, this.width - this.leftPadding]);
      this.scaleY.range([this.innerHeight, 0]);
      this.axisX.scale(this.scaleX).ticks(d3.time.year, 10);
      this.axisY.scale(this.scaleY).ticks(5);
      this.axisGroupX.call(this.axisX);
      this.axisGroupY.call(this.axisY);
      this.lineGenerator.x(function (d) {
        return _this8.scaleX(d.date);
      }).y(function (d) {
        return _this8.scaleY(d.price);
      });

      this.line.datum(data);

      this.line.attr('stroke-width', this.ended ? 1 : 4).attr('d', this.lineGenerator);
    }
  }, {
    key: 'transformPriceData',
    value: function transformPriceData(d) {
      d.date = formatDate.parse(d.time);
      d.price = +d.crude_petro_usd_bbl;
      return d;
    }
  }, {
    key: 'transformEventData',
    value: function transformEventData(d) {
      d.date = formatDateYear.parse(d.year);
      return d;
    }
  }]);

  return Vis;
}();
