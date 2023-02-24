// See extensionCut0.js for documentation of related case.

function tryExtensionCut4(svgGroup, se0, se1, arguments) {
    if (se0.isExtension && se1.isCut) {
        const e0 = se0.e;
        const e1 = se1.e;

        // In a 2 edges case, we want perfect alignment of the
        // corner points of both slices and the join vertex.
        // This requires dealing with both sides at once.

        let tp0 = 0;
        let tp1 = 0;

        if (e0.radius < e1.radius) {
            // extension of the narrow edge means it cuts into the wide edge
            tp1 = Math.min(se1.t, se1.tCutMax);
        }
        else {
            // extension of the wide edge means it connects onto the narrow edge
            if (se1.t < se1.tCutMax) {
                tp0 = 0;
                tp1 = se1.t;
            }
            else {
                //tp0 = (1 - (se1.tCutMax / se1.t)) * (se0.tCutMax - se0.t) + se0.t;
                tp1 = (se1.tCutMax / se1.t) * se1.tCutMax;
                tp0 = (1 - (tp1 / se1.t)) * (se0.tCutMax - se0.t) + se0.t;
            }

            //tp0 = se0.tCutMax;
        }

        let p0 = e0.outlinePoint(se0.side, tp0);
        let p1 = e1.outlinePoint(se1.side, tp1);

        let pX = p1;

        {
            let a = Vec2.ADD(joinVertex, e0.outgoingDirection.scaled(e0.length));
            let b = Vec2.ADD(e0.outlineOrigins[se0.side], e0.outgoingDirection.scaled(e0.length));
            svgGroup.polyline([a.asArray(), b.asArray(), p0.asArray(), pX.asArray(), joinVertex.asArray()])
                .fill({ color: e0.color, opacity: 0.5 })
                .stroke({ color: e0.color, opacity: 1.0, width: globals.inputGeometryStrokeWidth });
        }
        {
            let a = Vec2.ADD(joinVertex, e1.outgoingDirection.scaled(e1.length));
            let b = Vec2.ADD(e1.outlineOrigins[se1.side], e1.outgoingDirection.scaled(e1.length));
            svgGroup.polyline([a.asArray(), b.asArray(), p1.asArray(), pX.asArray(), joinVertex.asArray()])
                .fill({ color: e1.color, opacity: 0.5 })
                .stroke({ color: e1.color, opacity: 1.0, width: globals.inputGeometryStrokeWidth });
        }

        return true;
    }
    return false;
}
var tryExtensionCut4Method = {
    name: "ExtensionCut4",
    function: tryExtensionCut4,
    parameters: [
    ]
};
