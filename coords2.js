var coordinates = function(opts) {
	this.name = opts.data[0];
	this.data = opts.data[1];
	this.append = opts.append;
	if(opts.on_update) this.on_update = opts.on_update;
	this.selected = -1;
	this.draw();
	this.update();
}

coordinates.prototype.load = function(x) {
	this.data = x;	
	return this;
}

coordinates.prototype.draw = function() {
	this.coords = d3.select(this.append)
	.append("table")
	.attr("width", "130px")
}

coordinates.prototype.size = function(n) {
	var newdata = [];
	for(i = 0; i < n && i < this.data.length; ++i)
		newdata.push(this.data[i]);
	while(newdata.length < n)
	{
		var x = Math.floor(BM() * 100)/10
		var y = Math.floor(BM() * 100)/10
		
		x = (x > 10) ? 10 : x;
		x = (x < -10) ? -10 : x;

		y = (y > 10) ? 10 : y;
		y = (y < -10) ? -10 : y;

		newdata.push([x,y]);
	}

	this.data = newdata;

	this.update(1);

	return this;
}

coordinates.prototype.update = function(x) {
	//console.log(this.data);
	if(this.on_update != undefined && x == 1)
		this.on_update();


	var that = this;

	this.coords
		.selectAll("tr")
		.data(this.data)
		.enter()
		.append("tr")
		.style("text-align", "left")
			.append("td")
			.on("click", function(e, j) {
				if(that.selected == i)
					that.selected = -1;
				else
					that.selected = i;
				d3.select("." + that.name + "input" + i).node().focus();
				that.update();
			})
			.on("contextmenu", function(e, j) {
				d3.event.preventDefault();
				if(that.selected == i)
					that.selected = -1;
				else
					that.selected = i;
				that.update();
			})
		.append("input")
			.attr("type", "number")
			.attr("class", function(d,i){ return that.name + "input" + i})
			.on("focus", function(d, i) { 
				that.selected = i; 
				that.update();
			})
			.on("focusout", function(d, i) {
				that.selected = -1;
				that.update();
			})
			.on("keydown", function() {
				if(d3.event.which == 38 && that.selected >= 0)	
				{ //up
					val = that.data[that.selected][1]
					val += 0.2;
					if(val > 10) 
						val = 10;
					that.data[that.selected][1] = Number(val);
					that.update(1);
				}
				else if(d3.event.which == 40 && that.selected >= 0)	
				{ //down
					val = that.data[that.selected][1]
					val -= 0.2;
					if(val < -10) 
						val = -10;
					that.data[that.selected][1] = Number(val);
					that.update(1);
				}
				else if(d3.event.which == 37 && that.selected >= 0)	
				{ //left
					val = that.data[that.selected][0]
					val -= 0.2;
					if(val < -10) 
						val = -10;
					that.data[that.selected][0] = Number(val);
					that.update(1);
				}
				else if(d3.event.which == 39 && that.selected >= 0)	
				{ //right
					val = that.data[that.selected][0]
					val += 0.2;
					if(val > 10) 
						val = 10;
					that.data[that.selected][0] = Number(val);
					that.update(1);
				}
			})

	this.coords
		.selectAll("tr")
		.data(this.data)
		.exit().remove();

	this.coords
		.selectAll("tr")
		.data(this.data)
		.each(function(d, i) {
			d3.select(this).selectAll("td")
			.html(function(e, j) {
					return "<td style=\"text-align:left\">" + 
				        ((that.selected == i) ? ("<u>" + i + "</u>: ") : (i + ": "))	
					+ "(" 
					+ (Math.round(e[0]*10)/10) + ((e[0] % 1 == 0 && e[0] < 10 && e[0] > -10)? ".0" : "")
					+ ", "
					+ (Math.round(e[1]*10)/10) + ((e[1] % 1 == 0 && e[1] < 10 && e[1] > -10)? ".0" : "")
					+")</td>";			
			})
			.style("cursor", "default")
		})
		
}
