var plot = function(opts) {
	this.name = opts.data[0];
	this.data = opts.data[1];
	this.r = (opts.r)? opts.r : 1;
	this.adj_list = []

	this.append = opts.append;
	this.selected = -1;
	this.size = (opts.size)? opts.size : 700;
	if(opts.on_update) this.on_update = opts.on_update;
	this.draw();
	this.scan();
	this.update();
	this.plot.selectAll(".tick").selectAll("text")
		.attr("opacity", function(d) {
		return 1 - (parseInt(d3.select(this).node().innerHTML) == 0)
		})
}


plot.prototype.draw = function() {
	this.plot = d3.select(this.append)
		.select("svg")
		.attr("width", this.size+1)
		.attr("height", this.size+1)
		.style("border", "1px solid #ddd")

	this.Xscale = d3.scaleLinear()
		.range([0, this.size])
	this.Yscale = d3.scaleLinear()
		.range([this.size, 0])

	this.Xscale.domain([d3.min(this.data, function(d) { 
			return Math.min(0-Math.abs(d[0]), 0-Math.abs(d[1])
		)}) - 1, d3.max(this.data, function(d) { 
			return Math.max(Math.abs(d[0]), Math.abs(d[1]))
		}) + 1])

	this.Yscale.domain([d3.min(this.data, function(d) { 
			return Math.min(0-Math.abs(d[0]), 0-Math.abs(d[1])
		)}) - 1, d3.max(this.data, function(d) { 
			return Math.max(Math.abs(d[0]), Math.abs(d[1])
		)}) + 1])

	var ticks = [];
	for(i = -10; i < 11; ++i)
		if(i) ticks.push(i);

	this.VB = d3.axisRight(this.Yscale)
		.tickSize(4)
	this.HB = d3.axisBottom(this.Xscale)
		.tickSize(4)
	

	this.HBar = this.plot.append("g")
		.attr("transform", "translate(0,"
		+ this.Yscale(0)
		+ ")")

	this.VBar = this.plot.append("g")
		.attr("transform", "translate("
		+ this.Xscale(0)
		+ ",0)")

	this.VBar
		.attr("transform", "translate("+this.Xscale(0)+",0)")
		.call(this.VB);
	this.HBar
		.attr("transform", "translate(0,"+this.Yscale(0) +")")
		.call(this.HB);

	this.edges = this.plot.append("g")
	this.points = this.plot.append("g")
	this.radii = this.plot.append("g")

	this.plot.selectAll(".tick").classed("plot", true);
	this.plot.selectAll(".domain").classed("plot", true);
	this.plot.selectAll(".tick").selectAll("text")
		.attr("opacity", function(d) {
		return 1 - (parseInt(d3.select(this).node().innerHTML) == 0)
		})


	this.circles = this.points.selectAll("circle")
		.data(this.data)
		.enter()
		.append("circle");

	this.rings = this.radii.selectAll("circle")
		.data(this.data)
		.enter()
		.append("circle");

	this.lines = this.edges.selectAll("line")
		.data(this.adj_list)
		.enter()
		.append("line");
	
}

plot.prototype.within_r = function(i, j){
	var dx = this.data[i][0] - this.data[j][0];
	var dy = this.data[i][1] - this.data[j][1];
	var d = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
	return (d <= this.r);
}

plot.prototype.scan = function() {
	this.adj_list = []
	for(i = 0; i < this.data.length; ++i)
		for(j = 0; j < i; ++j)
			if(this.within_r(i, j))
				this.adj_list.push({from: i, to: j});
}

plot.prototype.load = function(x) {
	this.data = x;
	this.update();
	return this;
}

plot.prototype.radius = function(x) {
	this.r = x;
	this.update();
}

plot.prototype.length = function(x) {
	this.size = x;

	this.plot
		.transition().duration(80)
		.attr("width", this.size + 1)
		.attr("height", this.size + 1)

	this.update();

	return this;
}

plot.prototype.update = function(x) {
	if(this.on_update != undefined && x == 1)
		this.on_update();

	this.scan();

	this.Xscale
		.domain([
			d3.min(this.data, function(d) { 
				return Math.min(0-Math.abs(d[0]), 0-Math.abs(d[1])
			)}) - 1, 
			d3.max(this.data, function(d) { 
				return Math.max(Math.abs(d[0]), Math.abs(d[1]))
			}) + 1
		])
		.range([0, this.size])

	this.Yscale
		.domain([
			d3.min(this.data, function(d) { 
				return Math.min(0-Math.abs(d[0]), 0-Math.abs(d[1])
			)}) - 1, 
			d3.max(this.data, function(d) { 
				return Math.max(Math.abs(d[0]), Math.abs(d[1])
			)}) + 1
		])
		.range([this.size,0])


	this.VBar
		.transition().duration(50)
		.attr("transform", "translate("+this.Xscale(0)+",0)")
		.call(this.VB);
	this.HBar
		.transition().duration(50)
		.attr("transform", "translate(0,"+this.Yscale(0) +")")
		.call(this.HB);

	var that = this;

	this.circles = this.points.selectAll("circle")
		.data(this.data);

	this.rings = this.radii.selectAll("circle")
		.data(this.data);

	this.lines = this.edges.selectAll("line")
		.data(this.adj_list);

	this.circles
		.exit().remove();

	this.rings
		.exit().remove();

	this.lines
		.exit().remove();

	this.circles
		.enter()
		.append("circle")

	this.rings
		.enter()
		.append("circle")

	this.lines
		.enter()
		.append("line")

	this.points.selectAll("circle")
		.on("mouseover", function(d){d3.select(this).attr("r", 5);})
		.on("mouseleave", function(d){d3.select(this).attr("r", 4);})
		.attr("cursor", "grab")
		.transition().duration(30) // motion transition
		.attr("cx", function(d) { 
			return that.Xscale(d[0]);})
		.attr("cy", function(d) { 
			return that.Yscale(d[1]); })

	this.radii.selectAll("circle")
		.transition().duration(30) // motion transition
		.attr("cx", function(d) { 
			return that.Xscale(d[0]);})
		.attr("cy", function(d) { 
			return that.Yscale(d[1]); })

	this.edges.selectAll("line")
		.attr("x1", function(d) {
			return that.Xscale(that.data[d.from][0]);})
		.attr("x2", function(d) {
			return that.Xscale(that.data[d.to][0]);})
		.attr("y1", function(d) {
			return that.Yscale(that.data[d.from][1]);})
		.attr("y2", function(d) {
			return that.Yscale(that.data[d.to][1]);})
		.transition().duration(30)
		.attr("stroke", "black")
		.attr("stroke-opacity", 1)
		.attr("stroke-width", 2)


	this.points.selectAll("circle")
      		.call(
			d3.drag()
          			.on("drag", function(d,i){
  					d3.select(this).attr("cx", d3.event.x);
  					d3.select(this).attr("cy", d3.event.y);
  					d3.select(this).style("cursor", "grabbing");
  					d3.select("body").style("cursor", "grabbing");

					x = that.Xscale.invert(d3.select(this).attr("cx"));
					y = that.Yscale.invert(d3.select(this).attr("cy"))

					that.data[i][0] = x
					that.data[i][1] = y

					that.data[i][0] = (that.data[i][0] > 10) ? 10 : that.data[i][0];
					that.data[i][0] = (that.data[i][0] < -10) ? -10 : that.data[i][0];
					that.data[i][1] = (that.data[i][1] > 10) ? 10 : that.data[i][1];
					that.data[i][1] = (that.data[i][1] < -10) ? -10 : that.data[i][1];

					d3.select(this)
						.attr("cx", function(d) { 
							return that.Xscale(d[0]);})
						.attr("cy", function(d) { 
						return that.Yscale(d[1]); })

					that.radii.selectAll("circle")
						.attr("r", that.Xscale(that.r) - that.Xscale(0))

					that.update(1); 
					})
          			.on("end", function(d,i) { 
  					d3.select(this).style("cursor", "grab");
  					d3.select("body").style("cursor", "default");
				})
		)
		.transition().delay(50).duration(100)
		//visibility transition after motion transition to hide movement of entering circles
		 .attr("r", 4) 
	
	this.radii.selectAll("circle")
		.transition().delay(50).duration(10)
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", 2)
		.attr("stroke-opacity", 0.4 / Math.max(this.r, 1))
		.attr("r", this.Xscale(this.r) - this.Xscale(0))

}

