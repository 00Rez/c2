// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.RezPathfinder = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.RezPathfinder.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;
	
	behinstProto.findPath = function(start, destination)
	{
		if (this.index != -1 && this.astarExists)
		{
			return this.astar.findPath(start, destination);
		}
		else
		{
			return [];
		};
		
		alert(this.path.length);
	};

	behinstProto.onCreate = function()
	{
		var type, i, length;
	
		// Load properties
		this.myProperty = this.properties[0];
		
		// Variables
		this.debug = 0;
		this.astarExists = false;
		this.astar = null;
		this.path = [];

		if (cr.plugins_.RezAstar)
		{
			this.astarExists = true;
		};
		
		if (!this.astarExists) 
		{
			alert("Please add the Astar plugin to your project or if it already exists make sure it is named Astar.");
		};
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};

	//////////////////////////////////////
	// Conditions
	behaviorProto.cnds = {};
	var cnds = behaviorProto.cnds;

	//////////////////////////////////////
	// Actions
	behaviorProto.acts = {};
	var acts = behaviorProto.acts;
	
	acts.Setup = function (astar_objs)
	{	
        var astar = astar_objs.instances[0];
		
        if (astar.check_name == "ASTAR")
            this.astar = astar;
        else
            alert ("Pathfinder should connect to an Astar plugin");
	}; 
	
	acts.FindPath = function (sx, sy, dx, dy)
	{
		var ts;
		
		if (this.astarExists)
		{
			ts = this.astar.ts;
		
			sx = Math.round(sx / ts);
			sy = Math.round(sy / ts);
		
			dx = Math.round(dx / ts);
			dy = Math.round(dy / ts);
		
			this.path = this.findPath([sx, sy], [dx, dy]);
			
			this.debug = this.path.length;
		}
		else
		{
			this.path = [];
		};
	};

	//////////////////////////////////////
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;
	
	exps.PathX = function (ret, position)
	{
		var ts, pos;
		
		pos = cr.clamp(position, 0, this.path.length - 1);
		
		ts = this.astar.ts;
		
		if (this.path.length != [] && this.astar.map[this.path[pos].x][this.path[pos].y] == 0)
		{
			ret.set_int(this.path[pos].x * ts);
		}
		else
		{
			ret.set_int(this.inst.x);
		};
	};
	
	exps.PathY = function (ret, position)
	{
		var ts, pos;
		
		pos = cr.clamp(position, 0, this.path.length - 1);
		
		ts = this.astar.ts;
		
		if (this.path.length != [] && this.astar.map[this.path[pos].x][this.path[pos].y] == 0)
		{
			ret.set_int(this.path[pos].y * ts);
		}
		else
		{
			ret.set_int(this.inst.y);
		};
	};

	// debug expression
	exps.Debug = function (ret)
	{
		ret.set_int(this.debug);
	};
	
}());