function computePatchLimitsIndependent(svgGroup, angleSortedEdges, arguments) {
    for (let e of edges) {
        tCutMax = Math.min(arguments.coefficient * e.radius, e.length);
        e.tCutMax = [tCutMax, tCutMax];
        if (arguments.show) {
            drawPatchLimits(svgGroup, e);
        }
    }
}
var patchLimitIndependentMethod = {
    name: "patchLimitIndependent",
    function: computePatchLimitsIndependent,
    parameters: [
        { name: 'show', prettyName: 'Show', checked: true, type: 'checkbox' },
        { name: 'coefficient', prettyName: 'Coefficient', value: 2.5, type: 'range', min: 0, max: 10, step: 0.01 },
    ]
};