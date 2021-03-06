﻿function GetBehaviorSettings()
{
	return {
		"name":			"Pathfinder",			
		"id":			"RezPathfinder",			
		"version":		"0.23",					
		"description":	"This behaviour is connected to the Astar plugin to provide fast pathfinding.",
		"author":		"00Rez / Andrew Hall",
		"help url":		"https://github.com/00Rez/c2",
		"category":		"General",				
		"flags":		0						
						| bf_onlyone			
	};
};

////////////////////////////////////////
// Actions
AddNumberParam("Start X", "Intitial X start position.", "0");
AddNumberParam("Start Y", "Intitial X start position.", "0");
AddNumberParam("Destination X", "Final X end position.", "0");
AddNumberParam("Destination Y", "Final X end position.", "0");
AddComboParamOption("diagonals");
AddComboParamOption("no diagonals");
AddComboParam("Diagonals", "Whether to use diagonals or not." , 0);
AddComboParamOption("euclidean");
AddComboParamOption("manhattan");
AddComboParam("Heuristic", "Heuristic used for path finding." , 0);
AddAction(0, af_none, "Find path", "Pathfinding", "Find a <b>path</b> from <i>({0},{1})</i> to <i>({2},{3})</i> using <b>{4}</b>", "Find a path.", "FindPath");
AddObjectParam("Object", "This needs to be the Astar plugin");
AddAction(1, af_none, "Setup pathfinding", "Pathfinding", "Setup pathfinding using {0}", "Setup pathfinding.", "Setup");
AddAction(2, af_none, "Clear path", "Pathfinding", "Clear path", "Clear current path.", "ClearPath");
//AddNumberParam("Position", "Position in path to start from.", "0");
//AddAction(3, af_none, "Recalculate path", "Pathfinding", "Recalculate path", "Recalculate path using the provided and last position in the path list.", "RecalculatePath");

////////////////////////////////////////
// Expressions
AddNumberParam("Position", "Position in path.", "0");
AddExpression(0, ef_return_number, "PathX", "Pathfinding", "PathX", "This returns an X position based on a path position.");
AddNumberParam("Position", "Position in path.", "0");
AddExpression(1, ef_return_number, "PathY", "Pathfinding", "PathY", "This returns an Y position based on a path position.");
AddExpression(2, ef_return_number, "PathLength", "Pathfinding", "PathLength", "Returns the current path length zero if none.");

////////////////////////////////////////
ACESDone();

var property_list = [
	];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of the behavior in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// any other properties here, e.g...
	// this.myValue = 0;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
