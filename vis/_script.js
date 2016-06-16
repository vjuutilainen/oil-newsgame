'use strict';

let visPath = '/';

if(location.href.match('http://yle.fi/')) {
  visPath = 'http://yle.fi/plus/oil/';
}

const formatDate = d3.time.format('%YM%m');
const formatDateYear = d3.time.format('%Y');

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

class Vis {
  
  constructor(options) {
    this.parentContainer = d3.select('#esi-vis .init_container'); 
    this.container = d3.select('.vis_container');
    this.width = this.parentContainer[0][0].getBoundingClientRect().width;
    this.height = this.width / 2;
    this.padding = 40;
    this.leftPadding = 0;
    this.priceData = null;
    
    this.info = this.container.append('div').attr('class', 'info');
    this.svg = this.container.append('svg');
    this.content = this.svg.append('g').attr('class', 'content').attr('transform', 'translate(0, ' + (this.padding / 2) + ')');
    this.scaleX = d3.time.scale();
    this.scaleY = d3.scale.linear();
    this.axisX = d3.svg.axis().orient('bottom').ticks(10);
    this.axisY = d3.svg.axis().orient('right').ticks(10);
    this.axisGroupX = this.content.append('g').attr('class', 'axis-x').attr('transform', 'translate(0, ' + (this.height - 40) + ')');
    this.axisGroupY = this.content.append('g').attr('class', 'axis-y');
    this.lineGenerator = d3.svg.line().interpolate('basis').defined((d) => d.date > this.beginTime );
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

    window.onresize = () => {
      this.resizeGraph();
      this.updateGraph();
      this.updateInfoMarker();
      this.updatetransactionMarkers();
    };

  }

  loadData(cb) {
    d3.csv(visPath + 'vis/data/oil.csv', this.transformPriceData, (err, data) => {
      if(err) throw err;
      this.priceData = data;

      this.currentPrice = data[0].price;
      d3.csv(visPath + 'vis/data/events.csv', this.transformEventData, (err, data) => {
        if(err) throw err;
        this.eventData = data;
        cb(data);
      });
    });
  }

  initGraph(data) {
    this.linecontainer = this.content.append('g');
    this.line = this.linecontainer.append('path')
                            .attr('fill', 'none')
                            .attr('stroke-width', 4)
                            .attr('linecap', 'round')
                            .attr('stroke', 'white')
                            .attr('class', 'line');
  }

  initTransactionMarkers() {
    this.transactionMarkers = this.linecontainer.selectAll('.transactionmarker');
  }

  updatetransactionMarkers() {

    let join = this.transactionMarkers.data(this.transactionData);
    join.exit().remove();

    join.enter()
        .append('g').attr('class', 'transactionmarker')
        .each(function(d) {

          d3.select(this)
            .append('circle')
            .attr('r', '10')
            .attr('fill', (d) => {
              return d.type === 'BUY' ? 'rgb(255, 180, 0)' : 'rgb(0, 180, 200)';
            });

          d3.select(this).append('text').style('font-family', 'Open Sans, Arial').attr('font-size', '8px').attr('fill', 'white').attr('dx', 0).attr('text-anchor', 'middle').attr('dy', 3).text(d => d.price.toFixed(1));

        });

    join
      .attr('transform', (d) => {
        let x = this.scaleX(d.date);
        let y = this.scaleY(d.price);
        return 'translate('+x+','+y+')';
      });

    this.transactionMarkers = join;

  }

  init(cb) {
    this.loadData((data) => {
      this.initGraph();
      this.initTransactionMarkers();
      this.initInfoMarker();
      this.initInfo();
      this.resizeGraph();
      this.updateGraph();
      this.updatetransactionMarkers();
      if(cb) cb(this);
    });
  }

  resizeGraph() {
    this.width = this.parentContainer[0][0].getBoundingClientRect().width;
    this.height = this.width / 2;
    this.innerHeight = this.height - this.padding; 
    this.svg.attr('width', this.width).attr('height', this.height);
    this.axisGroupX.attr('transform', 'translate(0, ' + (this.height - 40) + ')');
  }

  getDataCrop(data) {

    let leftTime = new Date(this.currentTime);
    leftTime.setFullYear(leftTime.getFullYear() - 20);
    
    return data.filter(d => {
      return d.date >= leftTime && d.date <= this.currentTime;
    });

  }

  updateInfoMarker() {
    // this.infoMarker.attr({
    //   width: 10,
    //   height: this.height,
    //   x: this.width - 10,
    //   y: 0,
    // });
  }

  initInfoMarker() {
    // this.infoMarker = this.content.append('rect').attr({
    //   width: 10,
    //   height: this.height,
    //   x: this.width - 10,
    //   y: 0,
    //   fill: 'white', 
    //   opacity: 0.5
    // });
  }

  initInfo() {

    // other intro? !!!
    let html = '';
    this.info.html(html);

  }

  updateInfo() {
    
    let event = this.eventData.reduce((prev, curr) => {
      return curr.date <= this.currentTime ? curr : prev;
    }, this.eventData[0]);
    
    let html = '<h4>' + event.date.getFullYear() + '</h4>' +
                '<h3>' + event.title + '</h3>';
               
    this.info.html(html);
    
  }

  update() {

    let newTime = new Date(this.currentTime);
    
    newTime.setDate(newTime.getDate() + 3);

    //newTime.setMonth(newTime.getMonth() + 1);
    this.currentTime = newTime;
    if(this.currentTime > this.finalTime) {
      this.playing = false;
      this.currentTime = this.finalTime;
      this.initInfo();
      this.end();
    }
    else {
      this.updateInfo();
      this.updatetransactionMarkers();
      this.updateGraph();
    }

    
    

  }

  play() {

    this.playing = true;
    
    let tick = () => {
      if(this.playing && this.currentTime !== this.finalTime) {
       if(!this.transition) this.update(); 
       requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }



  end() {

    let data = this.priceData.filter(d => d.date >= this.beginTime);

    this.scaleX.domain(d3.extent(data, (d) => d.date ));
    this.scaleY.domain([0, d3.extent(data, (d) => d.price )[1]]);

    this.scaleX.range([0, this.width - this.leftPadding]);
    this.scaleY.range([this.innerHeight, 0]);
    this.axisX.scale(this.scaleX);
    this.axisY.scale(this.scaleY);

    this.axisGroupX.call(this.axisX);
    this.axisGroupY.call(this.axisY);

    this.lineGenerator.x((d) => { return this.scaleX(d.date); })
                      .y((d) => { return this.scaleY(d.price); });

    this.line.datum(data);

    this.line
        .attr('stroke-width', 1)
        .attr('d', this.lineGenerator);

    this.updatetransactionMarkers();


    if(this.onEnd) this.onEnd();

  }

  restart() {
    this.currentTime = this.beginTime;
    this.transactionData = [];
    this.updateGraph();
    this.initInfo();
    this.updatetransactionMarkers();
  }

  buy() {
    this.addTransactionMarker('BUY');
  }

  sell() {
    this.addTransactionMarker('SELL');
  }

  addTransactionMarker(type) {
    this.transactionData.push({type: type, date: this.currentTime, price: this.currentPrice });
  }

  stop() {
    this.playing = false;
    this.updateGraph();
    this.updatetransactionMarkers();
    this.updateInfo();
  }

  getCurrentPrice() {
    return this.currentPrice;
  }

  getCurrentYear() {
    return this.currentTime;
  }

  updateGraph() {

    let data = this.getDataCrop(this.priceData);

    this.currentPrice = data[data.length - 1].price;
    
    let xExtent = d3.extent(data, (d) => d.date );
    let yExtent = d3.extent(data, (d) => d.price );

    this.scaleX.domain(xExtent);
    this.scaleY.domain([0, yExtent[1]]);
    
    this.scaleX.range([0, this.width - this.leftPadding]);
    this.scaleY.range([this.innerHeight, 0]);
    this.axisX.scale(this.scaleX).ticks(d3.time.year, 10);
    this.axisY.scale(this.scaleY).ticks(5);

    this.axisGroupX.call(this.axisX);
    this.axisGroupY.call(this.axisY);

    this.lineGenerator.x((d) => { return this.scaleX(d.date); })
                      .y((d) => { return this.scaleY(d.price); });

    this.line.datum(data);

    this.line
        .attr('stroke-width', 4)
        .attr('d', this.lineGenerator);

  }

  transformPriceData(d) {
    d.date = formatDate.parse(d.time);
    d.price = +d.crude_petro_usd_bbl;
    return d;
  }

  transformEventData(d) {
    d.date = formatDateYear.parse(d.year);
    return d;
  }

}

