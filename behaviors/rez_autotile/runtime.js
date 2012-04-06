// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.RezAutotile = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.RezAutotile.prototype;
		
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

	behinstProto.onCreate = function()
	{
		// Load properties
		this.myProperty = this.properties[0];
		
		// object is sealed after this call, so make sure any properties you'll ever need are created, e.g.
		// this.myValue = 0;
		
		this.cx = this.inst.x;
		this.cy = this.inst.y;
		
		this.checked = 0;
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

	// the example condition
	cnds.TileChecked = function ()
	{
		return (this.checked > 2);
	};

	//////////////////////////////////////
	// Actions
	behaviorProto.acts = {};
	var acts = behaviorProto.acts;

	acts.Autotile = function ()
	{
		var b, layer1, layer2, dif, size, w, h, auto, x, y, list = this.inst.type.instances;
		
		w = this.inst.width;
		h = this.inst.height;
		
		if (w != h) {return false};
		
		size = w;
		
		for (x in list)
		{
			auto = 0;
			
			if (this.cx != list[x].x || this.cy != list[x].y) // if the current position is different:
			{
			for (y in list)
			{			
				
				// check up and down
				if (list[x].x == list[y].x && list[x].y != list[y].y)
				{
					dif = list[x].y - list[y].y;
					if (Math.abs(dif) == size)
					{
						if (dif > 0) {auto += 1}; // up
						if (dif < 0) {auto += 4}; // down
					}
				}
				
				if (list[x].y == list[y].y && list[x].x != list[y].x)
				{
					dif = list[x].x - list[y].x;
					if (Math.abs(dif) == size)
					{
						if (dif < 0) {auto += 2};
						if (dif > 0) {auto += 8};
					}
				}
				
				list[x].changeAnimFrame = auto;
		
				// start ticking if not already
				if (!list[x].isTicking)
				{
					list[x].runtime.tickMe(this);
					list[x].isTicking = true;
				}
		
				// not in trigger: apply immediately
				if (!list[x].inAnimTrigger) {list[x].doChangeAnimFrame()};
				
				for (b in list[x].behavior_insts)
					{
						if (b.id = "RezAutotile") 
						{
							b.cx = list[x].x;
							b.cy = list[x].y;
						};
					};
			}
			}
		}
	};

	acts.Update = function ()
	{
		// Reset the object so it gets checked for tiling again.
		this.cx = null;
		this.cy = null;
	};
	
	//////////////////////////////////////
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;

	// the example expression
	exps.AnimFrame = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.checked);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
}());