// @input Asset.ObjectPrefab myPrefab
// @input bool showAutomatically = false
// @input SceneObject parentObject

//@ui {"widget":"separator"}
// @input int numObjects = 92
// @input int numPerLevel = 100
// @input int levelHeight = 30
// @input int radiusIncrement = 25
// @input int spacePerObject = 25

var TAU = Math.PI * 2;

var allBuckets = [];
var currentShownBucket = 0;
var showingBuckets = script.showAutomatically;

script.api.show = function() {
	showingBuckets = true;
}

script.api.hide = function() {
	showingBuckets = false;

	for (var i = 0; i < allBuckets.length; i++) {
		allBuckets[i].enabled = false;
	}
}

function onTurnOn (eventData)
{
	var options = {
		numBuckets: script.numObjects,
		bucketsPerLevel: script.numPerLevel,
		levelHeight: script.levelHeight,

		startingRadius: 40,
		radiusIncrement: script.radiusIncrement,
		spacePerBucket: script.spacePerObject,
	}

	allBuckets = generateBuckets(options);
}

function onUpdate() {
	if (showingBuckets) {
		if (currentShownBucket < allBuckets.length) {
			allBuckets[currentShownBucket].enabled = true;
			currentShownBucket++;
		} else {
			showBuckets = false;
		}
	}
}

function createBucketFromPrefabAt(pos){
	var newObject = global.scene.createSceneObject("bucketInstance");
	newObject.setParent(script.parentObject);
    var instanceObject = script.myPrefab.instantiate(newObject);
    newObject.getTransform().setLocalPosition(pos);
    newObject.enabled = false;

    return newObject;
}

function generateLayerOfBuckets(options, numBuckets, y) {
	// States
	var buckets = [];
	var currentRadius = options.startingRadius;
	var previousRadiusBuckets = 0;

	for (var i = 0; i < numBuckets; i++) {
		// Figure out how many buckets in this radius
		var circumference = TAU * currentRadius;
		var step = Math.floor(circumference / options.spacePerBucket);

		// Figure out the angle of the bucket
		var anglePerObject = TAU / step;
		var bucketPosition = i - previousRadiusBuckets;
		var angle = anglePerObject * bucketPosition;

		// If bucket already fills circumference, increase radius
		if (bucketPosition >= step) {
			currentRadius += options.radiusIncrement
			previousRadiusBuckets = i;
		}

		// Find the position of the bucket
		var x = Math.cos(angle) * currentRadius;
		var z = Math.sin(angle) * currentRadius;

		var pos = new vec3(x, y, z);

		buckets.push(createBucketFromPrefabAt(pos));
	}

	return buckets;
}

function generateBuckets(options) {

	var numLevels = Math.floor(options.numBuckets / options.bucketsPerLevel);
	var leftovers = options.numBuckets % options.bucketsPerLevel;
	var level = [];
	var buckets = [];
	var levelOptions = {
		startingRadius: options.startingRadius,
		radiusIncrement: options.radiusIncrement,
		spacePerBucket: options.spacePerBucket,
	}

	// Generate full levels
	for (var i = 0; i < numLevels; i++) {
		level = generateLayerOfBuckets(levelOptions, options.bucketsPerLevel, i * options.levelHeight);
		buckets = buckets.concat(level);
	}
		
	// Generate leftover (last) level
	level = generateLayerOfBuckets(levelOptions, leftovers, i * options.levelHeight);
	buckets = buckets.concat(level);

	return buckets;
}

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onTurnOn);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);