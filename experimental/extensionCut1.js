// See extensionCut0.js for documentation of related case.

function tryExtensionCut1(svgGroup, se0, se1, arguments) {
    if (se0.isExtension && se1.isCut) {
        const e0 = se0.e;
        const e1 = se1.e;

        let tCutMax0 = se0.tCutMax;
        let tCutMax1 = se1.tCutMax;

        //const a = se1.radius * se1.radius - se0.radius * se0.radius;
        //const tStraightCutMax0 = Math.sqrt(tCutMax1 * tCutMax1 + a);
        //const tStraightCutMax1 = Math.sqrt(tCutMax0 * tCutMax0 - a);
        //if (tStraightCutMax0 < tCutMax0) {
        //    tCutMax0 = tStraightCutMax0;
        //} else if (tStraightCutMax1 < tCutMax1) {
        //    tCutMax1 = tStraightCutMax1;
        //}

        let p0 = e0.outlinePoint(se0.side, tCutMax0);
        let p1 = e1.outlinePoint(se1.side, Math.min(se1.t, tCutMax1));
        let p2 = p0.lerp(p1, tCutMax0 / (tCutMax0 + tCutMax1));

        // Let pX a point on [p0, p1] and [joinVertex, pX] be the segment that splits
        // the join in two halves (to have different colors).
        // We want pX to be at the orthogonal of the cut edge at the join vertex when the edges are colinear.
        // We want pX to be p1 when:
        // - cut t < maxCut
        // - extension t is 0 (seems covered by first condition)
        const isOvercut1 = se1.t > tCutMax1;
        let overcutRatio = isOvercut1 ? (1 - tCutMax1 / se1.t) : 0;
        let pX = p1.lerp(p2, overcutRatio);

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
var tryExtensionCut1Method = {
    name: "ExtensionCut1",
    function: tryExtensionCut1
};