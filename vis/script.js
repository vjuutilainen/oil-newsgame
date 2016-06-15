'use strict';

const formatDate = d3.time.format('%YM%m');

const events = {
  '1960M01': { title: 'Something here 1' },
  '1965M01': { title: 'Something here 2' },
  '1970M01': { title: 'Something here 3' },
  '1975M01': { title: 'Something here 4' },
  '1980M01': { title: 'Something here 5' },
  '1985M01': { title: 'Something here 6' },
  '1990M01': { title: 'Something here 7' },
  '1995M01': { title: 'Something here 8' },
  '2000M01': { title: 'Something here 9' },
  '2005M01': { title: 'Something here 10' },
  '2010M01': { title: 'Something here 11' },
  '2015M01': { title: 'Something here 12' }
};

const sampleTransactions = [
  { date: formatDate.parse('1960M01'), type: 'BUY', price: 1.63 },
  { date: formatDate.parse('1965M01'), type: 'BUY', price: 2 },
  { date: formatDate.parse('1970M01'), type: 'BUY', price: 3 },
  { date: formatDate.parse('1975M01'), type: 'BUY', price: 4 },
  { date: formatDate.parse('1980M01'), type: 'BUY', price: 5 },
  { date: formatDate.parse('1985M01'), type: 'BUY', price: 6 },
  { date: formatDate.parse('1990M01'), type: 'BUY', price: 7 },
  { date: formatDate.parse('1995M01'), type: 'BUY', price: 8 },
  { date: formatDate.parse('2000M01'), type: 'BUY', price: 9 },
  { date: formatDate.parse('2005M01'), type: 'BUY', price: 10 },
  { date: formatDate.parse('2010M01'), type: 'BUY', price: 11 },
  { date: formatDate.parse('2015M01'), type: 'BUY', price: 12 }
];

class Vis {
  
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerWidth / 2;
    this.padding = 20;
    this.priceData = null;
    this.container = d3.select('.vis_container'); 
    this.info = this.container.append('div').attr('class', 'info');
    this.svg = this.container.append('svg');
    this.content = this.svg.append('g').attr('class', 'content').attr('transform', 'translate(0, ' + (this.padding / 2) + ')');
    this.scaleX = d3.time.scale();
    this.scaleY = d3.scale.linear();
    this.axisX = d3.svg.axis().orient('top').ticks(10);
    this.axisY = d3.svg.axis().orient('right').ticks(10);
    this.axisGroupX = this.content.append('g').attr('class', 'axis-x');
    this.axisGroupY = this.content.append('g').attr('class', 'axis-y');
    this.lineGenerator = d3.svg.line().interpolate('basis').defined((d) => d.date >= this.beginTime );
    this.line = null;
    this.eventMarkers = null;

    this.beginTime = formatDate.parse('1960M01');
    this.currentTime = formatDate.parse('1960M01');
    this.finalTime = formatDate.parse('2016M05');

    this.currentPrice = null;
    this.transactionData = [];

    window.onresize = () => {
      this.resizeGraph();
      this.updateGraph();
      this.updateInfoMarker();
      this.updatetransactionMarkers();
      

      //this.updateMarkers();
    };

  }

  loadData(cb) {
    d3.csv('vis/data/oil.csv', this.transformData, (err, data) => {
      if(err) throw err;

      this.priceData = data;

      console.log(data);

      // make sample transactions !!!
      // this.transactionData = data.filter(d => Math.random() > 0.98).map(d => {
      //   d.type = Math.random() > 0.5 ? 'BUY' : 'SELL';
      //   return d;
      // }); 
      this.currentPrice = data[0].price;
      cb(data);
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
        .append('circle')
        .attr('r', '10')
        .attr('fill', (d) => {
          return d.type === 'BUY' ? 'rgb(255, 180, 0)' : 'rgb(0, 180, 200)';
        });

    join
        .attr('cx', (d) => this.scaleX(d.date))
        .attr('cy', (d) => this.scaleY(d.price));

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
    this.width = window.innerWidth;
    this.height = (window.innerWidth / 2) - this.padding;

    this.svg.attr('width', this.width).attr('height', this.height);
  }

  getDataCrop(data) {

    let leftTime = new Date(this.currentTime);
    leftTime.setFullYear(leftTime.getFullYear() - 10);
    
    return data.filter(d => {
      return d.date >= leftTime && d.date <= this.currentTime;
    });

  }

  updateInfoMarker() {
    this.infoMarker.attr({
      width: 20,
      height: this.height,
      x: this.width - 20,
      y: 0,
    });
  }

  initInfoMarker() {
    this.infoMarker = this.content.append('rect').attr({
      width: 20,
      height: this.height,
      x: this.width - 20,
      y: 0,
      fill: 'white', 
      opacity: 0.5
    });
  }

  initInfo() {

    let html = '<h3>Year ' + this.currentTime.getFullYear() + '</h3>' +
               '<h3>Price ' + this.currentPrice + '</h3>';

    this.info.html(html);

  }

  updateInfo() {
    //let identifier = this.currentTime.getFullYear() + 'M' + (this.currentTime.getMonth() + 1);
    //console.log(identifier);
    //if(events[identifier]) {
      let html = 
                 '<h3>Year ' + this.currentTime.getFullYear() + ' M' + (this.currentTime.getMonth() + 1)  + '</h3>' +
                 '<h3>Price ' + this.currentPrice + '</h3>';
      this.info.html(html);
    //}
    //else {
      //info.attr('opacity')
    //}
    
  }

  update() {

    let newTime = new Date(this.currentTime);
    
    newTime.setDate(newTime.getDate() + 15);

    //newTime.setMonth(newTime.getMonth() + 1);
    this.currentTime = newTime;
    if(this.currentTime >= this.finalTime) {
      this.playing = false;
      this.currentTime = this.finalTime;
    }

    this.updateGraph();
    this.updateInfo();
    this.updatetransactionMarkers();

  }

  play() {

    this.playing = true;
    
    let tick = () => {
      if(this.playing && this.currentTime !== this.finalTime) {
       requestAnimationFrame(tick); 
       this.update();
      }
    };

    requestAnimationFrame(tick);
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
    
    //console.log(data);

    this.scaleX.domain(d3.extent(data, (d) => d.date ));
    this.scaleY.domain(d3.extent(data, (d) => d.price ));

    this.scaleX.range([0, this.width]);
    this.scaleY.range([this.height, 0]);
    this.axisX.scale(this.scaleX);
    this.axisY.scale(this.scaleY);

    this.axisGroupX.call(this.axisX);
    this.axisGroupY.call(this.axisY);

    this.lineGenerator.x((d) => { return this.scaleX(d.date); })
                      .y((d) => { return this.scaleY(d.price); });

    this.line.datum(data);

    let timeTick = new Date(this.currentTime);
    timeTick.setMonth(timeTick.getMonth() + 1);

    let timeOffset = new Date(this.currentTime);
    timeOffset.setYear(timeOffset.getFullYear() + 10);

    this.line
        .attr('d', this.lineGenerator);

    // this.linecontainer
    //     .attr('transform', 'translate(' + 0 + ', ' + '0)');

        
        

  }

  transformData(d) {
    d.date = formatDate.parse(d.time);
    d.price = +d.crude_petro_usd_bbl;
    return d;
  }

}

