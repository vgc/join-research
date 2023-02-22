// See extensionCut0.js for documentation of related case.

function extCut8ComputePX(se0, se1) {
    const p0 = se0.outlineOrigin;
    const p1 = se1.e.outlinePoint(se1.side, se1.tCutMax);
    const pA = joinVertex.lerp(se1.outlineOrigin, se0.radius / se1.radius);
    const tX0 = intersectRays(
        p0,
        se0.e.outgoingDirection,
        p1,
        Vec2.SUBTRACT(pA, p1))[0];
    return se0.e.outlinePoint(se0.side, tX0);
}

function extCut8OppositeSliceEdge(se) {
    e = se.e;
    oppSide = se.side.opposite();
    oppSe = {
        e: e,
        side: oppSide
    };
    oppSe.tCutMax = e.tCutMax[oppSide];
    oppSe.radius = e.radii[oppSide];
    oppSe.outlineOrigin = e.outlineOrigins[oppSide];
    return oppSe;
}

function tryExtensionCut8(svgGroup, se0, se1, arguments) {
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
            if (se1.t <= se1.tCutMax) {
                p0 = se0.outlineOrigin;
                p1 = e1.outlinePoint(se1.side, se1.t);
                pX = p1;
            }
            else {
                p0 = se0.outlineOrigin;
                p1 = e1.outlinePoint(se1.side, se1.tCutMax);
                pX = extCut8ComputePX(se0, se1);
            }
        }
        else {
            // extension of the wide edge means it connects onto the narrow edge

            let t0 = 0;
            let t1 = se1.t;

            ose0 = extCut8OppositeSliceEdge(se0);
            ose1 = extCut8OppositeSliceEdge(se1);
            xx = intersectRays(
                ose0.outlineOrigin, ose0.e.outgoingDirection,
                ose1.outlineOrigin, ose1.e.outgoingDirection);
            ose0.t = xx[0];
            ose1.t = xx[1];

            if (ose0.t > ose0.tCutMax) {
                // compute the other side solution point

                pX = extCut8ComputePX(ose1, ose0);
                const tX1 = intersectRays(
                    se1.outlineOrigin,
                    e1.outgoingDirection,
                    pX,
                    Vec2.SUBTRACT(joinVertex, pX))[0];

                if (t1 > tX1) {
                    const c = ose0.tCutMax / ose0.t;
                    t0 = (1 - c * c) * se0.tCutMax;
                    t1 = tX1;
                }
            }

            t1 = Math.min(se1.tCutMax, t1);

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
var tryExtensionCut8Method = {
    name: "ExtensionCut8",
    prettyname: "ExtensionCut8",
    function: tryExtensionCut8,
    parameters: [
    ]
};
