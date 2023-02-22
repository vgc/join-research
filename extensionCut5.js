// See extensionCut0.js for documentation of related case.

function tryExtensionCut5(svgGroup, se0, se1, arguments) {
    if (se0.isExtension && se1.isCut) {
        const e0 = se0.e;
        const e1 = se1.e;

        // In a 2 edges case, we want perfect alignment of the
        // corner points of both slices and the join vertex.
        // This requires dealing with both sides at once.

        let p0 = new Vec2();
        let p1 = p0;
        let pX = p1;

        if (se0.radius < se1.radius) {
            // extension of the narrow edge means it cuts into the wide edge
            if (se1.t < se1.tCutMax) {
                p0 = se0.outlineOrigin;
                p1 = e1.outlinePoint(se1.side, se1.t);
                pX = p1;
            }
            else {
                p0 = se0.outlineOrigin;
                p1 = e1.outlinePoint(se1.side, se1.tCutMax);
                pX = p0.lerp(p1, se1.tCutMax / se1.t);
            }
            tp1 = Math.min(se1.t, se1.tCutMax);
        }
        else {
            // extension of the wide edge means it connects onto the narrow edge

            const h = Math.sqrt(se0.tCutMax*se0.tCutMax + se0.radius*se0.radius);
            const tCutA = Math.sqrt(h*h - se1.radius*se1.radius);

            let t0 = 0;
            let t1 = Math.min(se1.tCutMax, se1.t);

            if (se1.t > tCutA) {
                const c = tCutA / se1.t;
                t1 = t1 * c;
                t0 = (1 - c) * se0.tCutMax;
            }

            p0 = e0.outlinePoint(se0.side, t0);
            p1 = e1.outlinePoint(se1.side, t1);
            pX = p1;
        }

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
var tryExtensionCut5Method = {
    name: "ExtensionCut5",
    function: tryExtensionCut5,
    parameters: [
    ]
};
