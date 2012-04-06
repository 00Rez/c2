// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.RezAstar = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.RezAstar.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	
	/**
	* JavaScript BitArray - v0.1.1
	* 
	* Licensed under the revised BSD License.
	* Copyright 2010 Bram Stein
	* All rights reserved.
	*/
	
	/**
	* Creates a new empty BitArray, or initialises the BitArray with the given BitArray serialisation (an Array of integers.)
	*/
	var BitArray = function (values) {
		this.values = values || [];
	};

	/**
	* Returns the total number of bits in this BitArray.
	*/
	BitArray.prototype.size = function () {
		return this.values.length * 32;
	};

	/**
	* Sets the bit at index to a value (boolean.)
	*/
	BitArray.prototype.set = function (index, value) {
		var i = Math.floor(index / 32);
		// Since "undefined | 1 << index" is equivalent to "0 | 1 << index" we do not need to initialise the array explicitly here.
		if (value) {
			this.values[i] |= 1 << index - i * 32;
		} else {
			this.values[i] &= ~(1 << index - i * 32);
		}
		return this;
	};

	/**
	* Toggles the bit at index. If the bit is on, it is turned off. Likewise, if the bit is off it is turned on.
	*/
	BitArray.prototype.toggle = function (index) {
		var i = Math.floor(index / 32);
		this.values[i] ^= 1 << index - i * 32;
		return this;
	};

	/**
	* Returns the value of the bit at index (boolean.)
	*/
	BitArray.prototype.get = function (index) {
		var i = Math.floor(index / 32);
		return !!(this.values[i] & (1 << index - i * 32));
	};

	/**
	* Resets the BitArray so that it is empty and can be re-used.
	*/
	BitArray.prototype.reset = function () {
		this.values = [];
		return this;
	};

	/**
	* Returns a copy of this BitArray.
	*/
	BitArray.prototype.copy = function () {
		var cp = new BitArray();
		cp.length = this.length;
		cp.values = [].concat(this.values);
		return cp;
	};

	/**
	* Returns true if this BitArray equals another. Two BitArrays are considered
	* equal if both have the same length and bit pattern.
	*/
	BitArray.prototype.equals = function (x) {
		return this.values.length === x.values.length &&
			this.values.every(function (value, index) {
			return value === x.values[index];
		});
	};

	/**
	* Returns the JSON representation of this BitArray.
	*/
	BitArray.prototype.toJSON = function () {
		return JSON.stringify(this.values);
	};

	/**
	* Returns a string representation of the BitArray with bits
	* in logical order.
	*/
	BitArray.prototype.toString = function () {
		return this.toArray().map(function (value) {
			return value ? '1' : '0';
		}).join('');
	};

	/**
	* Returns the internal representation of the BitArray.
	*/
	BitArray.prototype.valueOf = function () {
		return this.values;
	};

	/**
	* Convert the BitArray to an Array of boolean values.
	*/
	BitArray.prototype.toArray = function () {
		var result = [];
		this.forEach(function (value, index) {
			result.push(value);
		});
		return result;
	};

	/**
	* Convert the BitArray to an Array of integers specifying which bits are set.
	*/
	BitArray.prototype.toIntArray = function () {
		var result = [];
		this.forEach(function (value, index) {
			if (value) {
				result.push(index);
			}
		});
		return result;
	};

	/**
	* Returns the total number of bits set to one in this BitArray.
	*/
	BitArray.prototype.count = function () {
		var total = 0;

		// If we remove the toggle method we could efficiently cache the number of bits without calculating it on the fly.
		this.values.forEach(function (x) {
			// See: http://bits.stephan-brumme.com/countBits.html for an explanation
			x  = x - ((x >> 1) & 0x55555555);
			x  = (x & 0x33333333) + ((x >> 2) & 0x33333333);
			x  = x + (x >> 4);
			x &= 0xF0F0F0F;

			total += (x * 0x01010101) >> 24;
		});
		return total;
	};

	/**
	* Iterate over each value in the BitArray.
	*/
	BitArray.prototype.forEach = function (fn, scope) {
		var i = 0, b = 0, index = 0,
			len = this.values.length,
			value, word;

		for (; i < len; i += 1) {
			word = this.values[i];
			for (b = 0; b < 32; b += 1) {
				value = (word & 1) !== 0;
				fn.call(scope, value, index, this);
				word = word >> 1;
				index += 1;
			}
		}
		return this;
	};

	/**
	* Inverts this BitArray.
	*/
	BitArray.prototype.not = function () {
		this.values = this.values.map(function (v) {
			return ~v;
		});
		return this;
	};

	/**
	* Bitwise OR on the values of this BitArray using BitArray x.
	*/
	BitArray.prototype.or = function (x) {
		if (this.values.length !== x.values.length) {
			throw 'Arguments must be of the same length.';
		}
		this.values = this.values.map(function (v, i) {
			return v | x.values[i];
		});
		return this;
	};

	/**
	* Bitwise AND on the values of this BitArray using BitArray x.
	*/
	BitArray.prototype.and = function (x) {
		if (this.values.length !== x.values.length) {
			throw 'Arguments must be of the same length.';
		}
		this.values = this.values.map(function (v, i) {
			return v & x.values[i];
		});
		return this;
	};

	/**
	* Bitwise XOR on the values of this BitArray using BitArray x.
	*/
	BitArray.prototype.xor = function (x) {
		if (this.values.length !== x.values.length) {
			throw 'Arguments must be of the same length.';
		}
		this.values = this.values.map(function (v, i) {
			return v ^ x.values[i];
		});
		return this;
	};
	
	/**
	Copyright (C) 2009 by Benjamin Hardin
	http://46dogs.blogspot.com/2009/10/star-pathroute-finding-javascript-code.html
	
	Copyright (C) 2012 by Andrew Hall

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

	*/
	
	function a_star(start, destination, board, columns, rows, extracost, tp_list)
	{
		//Create start and destination as true nodes
		start = new node(start[0], start[1], -1, -1, -1, -1);
		destination = new node(destination[0], destination[1], -1, -1, -1, -1);

		var open = []; //List of open nodes (nodes to be inspected)
		var closed = []; //List of closed nodes (nodes we've already inspected)
		var obv = new BitArray();
		var cbv = new BitArray();
		var g = 0; //Cost from start to current node
		var h = heuristic(start, destination); //Cost from current node to destination
		var f = g+h; //Cost from start to destination going through the current node
		var directions = 4; // Test to use for 4 or 8 directions

		//Push the start node onto the list of open nodes
		//open.push(start); 
		// insert in order so index 0 is always the best
		insertInOrder(open,start);
		// set it's bit
		obv.set(start.y * columns + start.x, true); 
		//Keep going while there's nodes in our open list
		while (open.length > 0)
		{
			//Find the best open node (lowest f value)

			//Alternately, you could simply keep the open list sorted by f value lowest to highest,
			//in which case you always use the first node
			var best_cost = open[0].f;
			var best_node = 0;
			
			//Set it as our current node
			var current_node = open[best_node];

			//Check if we've reached our destination
			if (current_node.x == destination.x && current_node.y == destination.y)
			{
				var path = [destination]; //Initialize the path with the destination node

				//Go up the chain to recreate the path 
				while (current_node.parent_index != -1)
				{
					current_node = closed[current_node.parent_index];
					path.unshift(current_node);
				}

				return path;
			}

			//Remove the current node from our open list
			open.splice(best_node, 1);
			//clear its bit
			obv.set(current_node.y * columns + current_node.x, false); 

			//Push it onto the closed list
			closed.push(current_node);
			// set it's bit O(1)
			cbv.set(current_node.y * columns + current_node.x, true); 
			//Expand our current node (look in all 8 directions)
			for (var new_node_x = Math.max(0, current_node.x-1); new_node_x <= Math.min(columns-1, current_node.x+1); new_node_x++)
				for (var new_node_y = Math.max(0, current_node.y-1); new_node_y <= Math.min(rows-1, current_node.y+1); new_node_y++)
				{
					if (board[new_node_x][new_node_y] == 0 //If the new node is open
						|| (destination.x == new_node_x && destination.y == new_node_y)) //or the new node is our destination
					{
						findPath(new_node_x, new_node_y, columns, rows, current_node, obv, cbv, destination, open, closed, extracost);
					}
				}
		}

		return [];
	}
	
	function findPath(x, y, col, row, cur, obv, cbv, dest, open, closed, extracost)
	{
		//See if the node is already in our closed list. If so, skip it.
		var found_in_closed = false;
				
		// optimization replaces the O(N) loop with O(1) bit check
		if(0 != cbv.get(y * col + x))
			found_in_closed= true;
		/*
		for (var i in closed)
		if (closed[i].x == new_node_x && closed[i].y == new_node_y)
		{
			found_in_closed = true;
			break;
		}
		*/
		if (found_in_closed)
			return;

		//See if the node is in our open list. If not, use it.
		var found_in_open = false;
		// same optimization as for the closed list
		if(0 != obv.get(y * col + x))
			found_in_open= true;
		/*
		for (var i in open)
		if (open[i].x == new_node_x && open[i].y == new_node_y)
		{
			found_in_open = true;
			break;
		}
		*/
		if (!found_in_open)
		{
			var new_node = new node(x, y, closed.length-1, -1, -1, -1);

			new_node.g = cur.g + Math.floor(Math.sqrt(Math.pow(new_node.x-cur.x, 2)+Math.pow(new_node.y-cur.y, 2)));
			new_node.h = heuristic(new_node, dest);
			new_node.f = new_node.g + new_node.h + extracost[x][y];
			// insert in order so index 0 is always the best
			insertInOrder(open,new_node);
				//open.push(new_node);
			// set the bit after pushing element
			obv.set(y * col + x, true); 
		}
	}

	//An A* heurisitic must be admissible, meaning it must never overestimate the distance to the goal.
	//In other words, it must either underestimate or return exactly the distance to the goal.
	function heuristic(current_node, destination)
	{
		//Find the straight-line distance between the current node and the destination. (Thanks to id for the improvement)
		//return Math.floor(Math.sqrt(Math.pow(current_node.x-destination.x, 2)+Math.pow(current_node.y-destination.y, 2)));
		var x = current_node.x - destination.x;
		var y = current_node.y - destination.y;
		return Math.sqrt(x*x+y*y);
	}


	/* Each node will have six values: 
		X position
		Y position
		Index of the node's parent in the closed array
		Cost from start to current node
		Heuristic cost from current node to destination
		Cost from start to destination going through the current node
	*/	

	function node(x, y, parent_index, g, h, f)
	{
		this.x = x;
		this.y = y;
		this.parent_index = parent_index;
		this.g = g;
		this.h = h;
		this.f = f;
	}

	function insertInOrder(ar, node)
	{
		var track = 0;
		var aro;
		var i = 0;
		var max = ar.length - 1;
		var min = 0;
		while ((max-min) > 1)
		{
			track++;
			i = (max+min) >> 1;
			if (ar[i].f > node.f)
			max = i - 1;
			else min = i + 1;
		}

		i=max;
		while (ar[i] != undefined && ar[i].f == node.f)
		{
			track++;
			i++;
		}
		if (ar[i] != undefined && ar[i].f < node.f)
			i++;
		ar.splice(Math.max(i,0), 0, node);
		return track;
	}

	function createMap(w,h)
	{
		if (!w) {return false};
		if (!h) {return false};
	
		var map = [];
		map.length = h;
	
		for (var i = 0; i < w; i++)
		{
			map[i] = [];
			for (var j = 0; j < h; j++)
			{			
				map[i].push(0);
			};
		};
		
		return map;
	};
	
	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{				
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	instanceProto.useObjects = function(obj, solid, cost, method)
	{
		var sol, length, i, sx, sy, dx, dy, tx, ty;
		
		sol = obj.instances;
		length = sol.length;
		
		for (i = 0; i < length; i++)
		{
			sx = sol[i].x - (sol[i].width / 2);
			sy = sol[i].y - (sol[i].height / 2);
			
			sx = cr.clamp(Math.round(sx / this.ts), 0, this.gw - 1);
			sy = cr.clamp(Math.round(sy / this.ts), 0, this.gh - 1);
			
			dx = sol[i].x + (sol[i].width / 2);
			dy = sol[i].y + (sol[i].height / 2);
			
			dx = cr.clamp(Math.round(dx / this.ts), 0, this.gw - 1);
			dy = cr.clamp(Math.round(dy / this.ts), 0, this.gh - 1);
			
			for (tx = sx; tx <= dx; tx++)
			{
				for (ty = sy; ty <= dy; ty++)
				{
					sol[i].update_bbox();
					sol[i].set_bbox_changed();
					if (sol[i].bbox.contains_pt(tx * this.ts, ty * this.ts))
					{
						// == This will add all the bbox.
						this.map[tx][ty] = solid; // Solidify.
						
						if (method == 0) // replace
							this.cost[tx][ty] = cost; // Reset cost to zero.
						else //add
							this.cost[tx][ty] += cost;
						
						this.changes.push([tx, ty]);
						
						/* == This will only add the outline of the bbox.
						if (tx == sx || tx == dx)
						{
							this.map[tx][ty] = solid;
							this.cost[tx][ty] = cost; // Reset cost to zero.
							this.changes.push([tx, ty]);
						};
						
						if (ty == sy || ty == dy)
						{
							this.map[tx][ty] = solid;
							this.map[tx][ty] = 0; // Reset cost to zero.
							this.changes.push([tx, ty]);
						};
						*/
					};
				};
			};
		};
	};
	
	instanceProto.findPath = function(start, destination)
	{
		return a_star(start, destination, this.map, this.gw, this.gh, this.cost, this.tp_list)
	};
	
	instanceProto.clearMap = function ()
	{
		var change;
	
		// uses a list of changed cells for speed
		if (this.changes != [])
		{
			for (change in this.changes) // need to change this!
			{
				this.map[change[0]][change[1]] = 0;
			};
		};
		
		this.changes = [];
		
		return true;
	};

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.data = [];
		this.debug = 0;
		this.check_name = "ASTAR";
		
		this.changes = [];
		
		this.ts = this.properties[0];
		this.gw = this.properties[1];
		this.gh = this.properties[2]; 
		
		this.map = createMap(this.gw, this.gh);
		this.cost = createMap(this.gw, this.gh);
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};
	
	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;
	
	acts.BlockPathUsingObject = function (obj)
	{
		this.useObjects(obj, 1, 0);
	};
	
	acts.UnblockPathUsingObject = function (obj)
	{
		this.useObjects(obj, 0);
	};
	
	acts.SetCostUsingObject = function (obj, cost, method)
	{
		this.useObjects(obj, 0, cost, method);
	};
	
	acts.ClearGrid = function ()
	{
		this.clearMap();
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	exps.Debug = function (ret)
	{
		ret.set_int(this.debug);
	};

}());