// -----JS CODE-----
// @input SceneObject tapInstruction
// @input SceneObject fullscreenButton
// @input Component.ScriptComponent bucketController
// @input Component.ScriptComponent sodaController

script.api.onPress = onPress;

var bucketHasBeenShown = false;
var sodaHasBeenShown = false;

script.fullscreenButton.enabled = false;

function onPress() {
	if (!bucketHasBeenShown) {
		recurse(script.getSceneObject(), callBuckets);
		global.tweenManager.startTween(script.tapInstruction, "a", enableFullScreenButton);
		script.bucketController.api.show();
		bucketHasBeenShown = true;
	} else if (!sodaHasBeenShown) {
		recurse(script.getSceneObject(), callSoda);
		global.tweenManager.startTween(script.tapInstruction, "c");
		script.bucketController.api.hide();
	 	script.sodaController.api.show();
	 	sodaHasBeenShown = true;
	}
}

function callBuckets(root) {
 	global.tweenManager.startTween( root, "a" )
 	global.tweenManager.startTween( root, "b" )
}

function callSoda(root) {
 	global.tweenManager.startTween( root, "c" )
 	global.tweenManager.startTween( root, "d" )
}

function enableFullScreenButton() {
	print("EA")
	script.fullscreenButton.enabled = true;
}

function recurse(root, fn) {
	for (var i = 0; i < root.getChildrenCount(); i++ ) {
		var child = root.getChild(i);
		recurse(child, fn);
	}

	if (fn) fn(root);
}