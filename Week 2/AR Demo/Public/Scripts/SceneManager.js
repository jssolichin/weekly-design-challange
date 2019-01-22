// -----JS CODE-----
// @input SceneObject root
// @input SceneObject rearInstruction
// @input SceneObject frontInstruction


var event = script.createEvent("CameraFrontEvent");
event.bind(function (eventData)
{
    script.root.enabled = false;

    script.frontInstruction.enabled = true;
    script.rearInstruction.enabled = false;
});

var event = script.createEvent("CameraBackEvent");
event.bind(function (eventData)
{
    script.root.enabled = true;

    script.frontInstruction.enabled = false;
    script.rearInstruction.enabled = true;
});