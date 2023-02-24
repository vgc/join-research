// See extensionCut0.js for documentation of related case.

function tryExtensionCut2(svgGroup, se0, se1, arguments) {
    if (se0.isExtension && se1.isCut) {
        const e0 = se0.e;
        const e1 = se1.e;
        let p0 = e0.outlinePoint(se0.side, se0.tCutMax);
        let p1 = e1.outlinePoint(se1.side, Math.min(se1.t, se1.tCutMax));

        // Let pX a point on [p0, p1] and [joinVertex, pX] be the segment that splits
        // the join in two halves (to have different colors).
        // We want pX to be at the orthogonal of the cut edge at the join vertex when the edges are colinear.
        // We want pX to be p1 when:
        // - cut t < maxCut
        // - extension t is 0 (seems covered by first condition)

        let p2 = p0.lerp(p1, se0.tCutMax / (se0.tCutMax + se1.tCutMax));
        let pX = p1;

        const pSplit = (e0.radius < e1.radius) ? e1.outlineOrigins[se1.side] : e0.outlineOrigins[se0.side];
        const maxRadius = Math.max(e0.radius, e1.radius)
        const ortho = Vec2.SUBTRACT(pSplit, joinVertex).normalized();
        const p1p0 = Vec2.SUBTRACT(p0, p1).normalized();
        const w = Vec2.SUBTRACT(p1, joinVertex);
        const ddet = Vec2.DET(ortho, p1p0);
        const ddetInv = 1 / ddet;
        const tOrtho = Vec2.DET(w, p1p0) * ddetInv;
        const tSlope = Vec2.DET(w, ortho) * ddetInv;

        if (e0.radius < e1.radius) {
            pX = Vec2.ADD(joinVertex, ortho.scaled(tOrtho));
            // optional
            //let cutRatio = se1.isOvercut ? 1 : se1.t / se1.tCutMax;
            //const cr = (1 - cutRatio)
            //pX = pX.lerp(p1, cr * cr);
        }
        else if (tSlope > 0 && Vec2.DOT(p1p0, e0.outgoingDirection) > 0) {
            pX = Vec2.ADD(joinVertex, ortho.scaled(tOrtho));
        }
        else {
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
var tryExtensionCut2Method = {
    name: "ExtensionCut2",
    function: tryExtensionCut2
};