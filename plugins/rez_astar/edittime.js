function GetPluginSettings()
{
	return {
		"name":			"Astar",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"RezAstar",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"0.1",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"This plugin is used with the behaviour Pathfinder to allow fast pathfinding.",
		"author":		"Andrew Hall / 00Rez",
		"help url":		"<your website or a manual entry on Scirra.com>",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"flags":		0						// uncomment lines to enable flags...
	};
};

////////////////////////////////////////
// Actions
AddObjectParam("Object", "Object to use for blocking.");
AddAction(0, af_none, "Block path using object", "Pathfinding", "Use {0} to block paths", "Block path using an object.", "BlockPathUsingObject");

AddAction(1, af_none, "Clear map of all blockers", "Pathfinding", "Clear map of all blockers", "Clear the map of all blockers.", "ClearMap");

AddObjectParam("Object", "Object to use for unblocking.");
AddAction(2, af_none, "Unblock path using object", "Pathfinding", "Use {0} to unblock paths", "Unblock path using an object.", "UnblockPathUsingObject");


////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_any, "Debug value", "Debug", "Debug", "Debug value.");

////////////////////////////////////////
ACESDone();

var property_list = [
	new cr.Property(ept_integer, 	"Cell size",		32,		"The cell size for astar pathfinding."),
	new cr.Property(ept_integer, 	"Grid width",		128,		"Grid width in cells."),
	new cr.Property(ept_integer, 	"Grid height",		128,		"Grid height in cells.")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
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
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}