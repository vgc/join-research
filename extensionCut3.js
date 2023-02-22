// See extensionCut0.js for documentation of related case.

function tryExtensionCut3(svgGroup, se0, se1, arguments) {
    if (se0.isExtension && se1.isCut) {
        const e0 = se0.e;
        const e1 = se1.e;

        const pWide = (e0.radius < e1.radius) ? e1.outlineOrigins[se1.side] : e0.outlineOrigins[se0.side];
        const dWide = Vec2.SUBTRACT(pWide, joinVertex);

        let tp0 = Math.min(-se0.t, se0.tCutMax);
        if (!arguments.mirrorCut) {
            tp0 = se0.tCutMax;
        }
        let tp1 = Math.min(se1.t, se1.tCutMax);

        {
            const se = (e0.radius < e1.radius) ? se0 : se1;
            const e = se.e;
            const t = intersectRays(
                e.outlineOrigins[se.side],
                e.outgoingDirection,
                joinVertex,
                dWide)[0];
            if (isFinite(t)) {
                if (e0.radius < e1.radius) {
                    tp0 = Math.min(tp0, t);
                }
                else {
                    tp1 = Math.min(tp1, t);
                }
            }
        }

        let p0 = e0.outlinePoint(se0.side, tp0);
        let p1 = e1.outlinePoint(se1.side, tp1);

        let p2 = p0.lerp(p1, se0.tCutMax / (se0.tCutMax + se1.tCutMax));
        let pX = p1;

        const maxRadius = Math.max(e0.radius, e1.radius)
        const ortho = Vec2.SUBTRACT(pWide, joinVertex).normalized();
        const p1p0 = Vec2.SUBTRACT(p0, p1).normalized();
        const w = Vec2.SUBTRACT(p1, joinVertex);
        const ddet = Vec2.DET(ortho, p1p0);
        const ddetInv = 1 / ddet;
        const tOrtho = Vec2.DET(w, p1p0) * ddetInv;
        const tSlope = Vec2.DET(w, ortho) * ddetInv;

        if (e0.radius < e1.radius) {
            pX = Vec2.ADD(joinVertex, ortho.scaled(tOrtho));
            // optional
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
var tryExtensionCut3Method = {
    name: "ExtensionCut3",
    function: tryExtensionCut3,
    parameters: [
        {
            name: 'mirrorCut',
            prettyName: 'Mirror cut on wide edge',
            type: 'checkbox',
            checked: true
        },
    ]
};