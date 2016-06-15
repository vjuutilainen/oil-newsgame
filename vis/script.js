'use strict';

const formatDate = d3.time.format('%YM%m');

const events = {
  '1960M01': { title: 'Something here' },
  '1965M01': { title: 'Something here' },
  '1970M01': { title: 'Something here' },
  '1975M01': { title: 'Something here' },
  '1980M01': { title: 'Something here' },
  '1985M01': { title: 'Something here' },
  '1990M01': { title: 'Something here' },
  '1995M01': { title: 'Something here' },
  '2000M01': { title: 'Something here' },
  '2005M01': { title: 'Something here' },
  '2010M01': { title: 'Something here' },
  '2015M01': { title: 'Something here' }
};

class Vis {
  
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerWidth / 2;
    this.priceData = null;
    this.container = d3.select('.vis_container'); 
    this.info = this.container.append('div').attr('class', 'info');
    this.svg = this.container.append('svg');
    this.content = this.svg.append('g').attr('class', 'content');
    
    this.scaleX = d3.time.scale();
    this.scaleY = d3.scale.linear();
    this.axisX = d3.svg.axis().orient('bottom').ticks(10);
    this.axisY = d3.svg.axis().orient('right').ticks(10);
    this.axisGroupX = this.content.append('g').attr('class', 'axis-x');
    this.axisGroupY = this.content.append('g').attr('class', 'axis-y');
    this.lineGenerator = d3.svg.line();
    this.line = null;
    this.eventMarkers = null;

    window.onresize = () => {
      this.resizeGraph();
      this.updateGraph();
      this.updateMarkers();
    };

  }

  loadData(cb) {
    d3.csv('data/oil.csv', this.transformData, (err, data) => {
      if(err) throw err;
      this.priceData = data;
      cb(data);
    });
  }

  initGraph(data) {
    this.line = this.content.append('path')
                            .attr('fill', 'none')
                            .attr('stroke', 'black')
                            .attr('class', 'line').datum(data);
  }

  initMarkers() {

    this.eventMarkers = this.content
                      .selectAll('.eventmarker')
                      .data(this.priceData.filter(d => d.event))
                      .enter()
                      .append('circle')
                      .attr('r', '5')
                      .attr('fill', 'red');
  }

  updateMarkers() {
    this.eventMarkers
        .attr('cx', (d) => this.scaleX(d.date))
        .attr('cy', (d) => this.scaleY(d.price));
  }

  init() {
    this.loadData((data) => {
      this.initGraph(data);
      this.initMarkers();
      this.resizeGraph();
      this.updateGraph();
      this.updateMarkers();
    });
  }

  resizeGraph() {
    this.width = window.innerWidth;
    this.height = window.innerWidth / 2;

    this.svg.attr('width', this.width).attr('height', this.height);
  }

  updateGraph() {
    this.scaleX.domain(d3.extent(this.priceData, (d) => d.date ));
    this.scaleY.domain(d3.extent(this.priceData, (d) => d.price ));
    this.scaleX.range([0, this.width]);
    this.scaleY.range([this.height, 0]);
    this.axisX.scale(this.scaleX);
    this.axisY.scale(this.scaleY);

    this.axisGroupX.call(this.axisX);
    this.axisGroupY.call(this.axisY);

    this.lineGenerator.x((d) => { return this.scaleX(d.date); })
                      .y((d) => { return this.scaleY(d.price); });


    this.line.attr('d', this.lineGenerator);

  }

  transformData(d) {
    d.date = formatDate.parse(d.time);
    d.price = +d.crude_petro_usd_bbl;
    d.event = events[d.time] ? events[d.time] : false; 
    return d;
  }

}

window.onload = () => {
  new Vis().init();
};
