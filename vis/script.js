'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var visPath = '/';

if (location.href.match('http://yle.fi/')) {
  visPath = 'http://yle.fi/plus/oil/';
}

var formatDate = d3.time.format('%YM%m');
var formatDateYear = d3.time.format('%Y');

// const sampleTransactions = [
//   { date: formatDate.parse('1960M01'), type: 'BUY', price: 1.63 },
//   { date: formatDate.parse('1965M01'), type: 'BUY', price: 2 },
//   { date: formatDate.parse('1970M01'), type: 'BUY', price: 3 },
//   { date: formatDate.parse('1975M01'), type: 'BUY', price: 4 },
//   { date: formatDate.parse('1980M01'), type: 'BUY', price: 5 },
//   { date: formatDate.parse('1985M01'), type: 'BUY', price: 6 },
//   { date: formatDate.parse('1990M01'), type: 'BUY', price: 7 },
//   { date: formatDate.parse('1995M01'), type: 'BUY', price: 8 },
//   { date: formatDate.parse('2000M01'), type: 'BUY', price: 9 },
//   { date: formatDate.parse('2005M01'), type: 'BUY', price: 10 },
//   { date: formatDate.parse('2010M01'), type: 'BUY', price: 11 },
//   { date: formatDate.parse('2015M01'), type: 'BUY', price: 12 }
// ];

var Vis = function () {
  function Vis() {
    var _this = this;

    _classCallCheck(this, Vis);

    this.width = window.innerWidth;
    this.height = window.innerWidth / 2;
    this.padding = 40;
    this.leftPadding = 20;
    this.priceData = null;
    this.container = d3.select('.vis_container');
    this.info = this.container.append('div').attr('class', 'info');
    this.svg = this.container.append('svg');
    this.content = this.svg.append('g').attr('class', 'content').attr('transform', 'translate(0, ' + this.padding / 2 + ')');
    this.scaleX = d3.time.scale();
    this.scaleY = d3.scale.linear();
    this.axisX = d3.svg.axis().orient('top').ticks(10);
    this.axisY = d3.svg.axis().orient('right').ticks(10);
    this.axisGroupX = this.content.append('g').attr('class', 'axis-x');
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

    window.onresize = function () {
      _this.resizeGraph();
      _this.updateGraph();
      _this.updateInfoMarker();
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

      join.enter().append('circle').attr('r', '10').attr('fill', function (d) {
        return d.type === 'BUY' ? 'rgb(255, 180, 0)' : 'rgb(0, 180, 200)';
      });

      join.attr('cx', function (d) {
        return _this3.scaleX(d.date);
      }).attr('cy', function (d) {
        return _this3.scaleY(d.price);
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
        _this4.initInfoMarker();
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
      this.width = window.innerWidth;
      this.height = window.innerWidth / 2;
      this.innerHeight = this.height - this.padding * 2;

      this.svg.attr('width', this.width).attr('height', this.height);
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
    key: 'updateInfoMarker',
    value: function updateInfoMarker() {
      this.infoMarker.attr({
        width: 10,
        height: this.height,
        x: this.width - 10,
        y: 0
      });
    }
  }, {
    key: 'initInfoMarker',
    value: function initInfoMarker() {
      this.infoMarker = this.content.append('rect').attr({
        width: 10,
        height: this.height,
        x: this.width - 10,
        y: 0,
        fill: 'white',
        opacity: 0.5
      });
    }
  }, {
    key: 'initInfo',
    value: function initInfo() {

      // other intro? !!!
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

      // ' M' + (this.currentTime.getMonth() + 1)  +
      var html = '<h4>Year ' + this.currentTime.getFullYear() + ', Price ' + this.currentPrice.toFixed(2).replace('.', ',') + '</h4>' + '<h3>' + event.title + '</h3>';

      this.info.html(html);
    }
  }, {
    key: 'update',
    value: function update() {

      var newTime = new Date(this.currentTime);

      newTime.setDate(newTime.getDate() + 10);

      //newTime.setMonth(newTime.getMonth() + 1);
      this.currentTime = newTime;
      if (this.currentTime > this.finalTime) {
        this.playing = false;
        this.currentTime = this.finalTime;
        this.initInfo();
        this.end();
      } else {
        this.updateInfo();
        this.updatetransactionMarkers();
        this.updateGraph();
      }
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
    key: 'end',
    value: function end() {
      var _this8 = this;

      var data = this.priceData.filter(function (d) {
        return d.date >= _this8.beginTime;
      });

      this.scaleX.domain(d3.extent(data, function (d) {
        return d.date;
      }));
      this.scaleY.domain([0, d3.extent(data, function (d) {
        return d.price;
      })[1]]);

      this.scaleX.range([0, this.width - this.leftPadding]);
      this.scaleY.range([this.innerHeight, 0]);
      this.axisX.scale(this.scaleX);
      this.axisY.scale(this.scaleY);

      this.axisGroupX.call(this.axisX);
      this.axisGroupY.call(this.axisY);

      this.lineGenerator.x(function (d) {
        return _this8.scaleX(d.date);
      }).y(function (d) {
        return _this8.scaleY(d.price);
      });

      this.line.datum(data);

      this.line.attr('stroke-width', 1).attr('d', this.lineGenerator);

      this.updatetransactionMarkers();
    }
  }, {
    key: 'restart',
    value: function restart() {
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
      var _this9 = this;

      var data = this.getDataCrop(this.priceData);

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
      this.axisX.scale(this.scaleX);
      this.axisY.scale(this.scaleY);

      this.axisGroupX.call(this.axisX);
      this.axisGroupY.call(this.axisY);

      this.lineGenerator.x(function (d) {
        return _this9.scaleX(d.date);
      }).y(function (d) {
        return _this9.scaleY(d.price);
      });

      this.line.datum(data);

      this.line.attr('stroke-width', 4).attr('d', this.lineGenerator);

      //    this.transition = true;

      // this.linecontainer
      //     .attr('transform', null)
      //     .transition()
      //     .duration(1000)
      //     .attr('transform', 'translate(' + 0 + ', ' + '0)')
      //     .each('end', () => {
      //       console.log('dendnd');
      //       this.transition = false;
      //     });
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
