function computePatchLimitsUniform(svgGroup, angleSortedEdges, arguments) {
    v = [Infinity, 0, 0]
    for (let e of edges) {
        v[0] = Math.min(e.radius, v[0]);
        v[1] = Math.max(e.radius, v[1]);
        v[2] += e.radius;
    }
    v[2] = v[2] / edges.length;
    tCutMax = v[arguments.func] * arguments.coefficient;
    for (let e of edges) {
        e.tCutMax = [
            tCutMax,
            tCutMax
        ];
        if (arguments.show) {
            drawPatchLimits(svgGroup, e);
        }
    }
}
var patchLimitUniformMethod = {
    name: "patchLimitUniform",
    function: computePatchLimitsUniform,
    parameters: [
        { name: 'show', prettyName: 'Show', checked: true, type: 'checkbox' },
        { name: 'coefficient', prettyName: 'Coefficient', value: 2.5, type: 'range', min: 0, max: 10, step: 0.01 },
        {
            name: 'func', prettyName: 'Function', type: 'select', initialOptionIndex: 2, options: [
                { prettyName: "minimum", },
                { prettyName: "maximum", },
                { prettyName: "average", }]
        },
    ]
};