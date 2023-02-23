// depends on computeTangentRayToCircle from allCasesMinRadius1

function allCasesMinRadius3(svgGroup, se0, se1, arguments) {

    if (se0.radius == se1.radius) {
        const e0 = se0.e;
        const e1 = se1.e;
    }
    else {
        if (se0.radius < se1.radius) {
            [se0, se1] = [se1, se0];
        }
        const e0 = se0.e;
        const e1 = se1.e;

        // bevel tangent points
        const p0 = e0.outlinePoint(se0.side, se0.tCutMax);
        [tp1, tp2] = computeTangentRayToCircle(p0, joinVertex, se1.radius);
        if (Vec2.DOT(Vec2.SUBTRACT(tp2, joinVertex), e0.outgoingDirection)
            < Vec2.DOT(Vec2.SUBTRACT(tp1, joinVertex), e0.outgoingDirection)) {
            [tp1, tp2] = [tp2, tp1];
        }
        //svgGroup.circle(5).fill({ color: 'purple', opacity: 1.0 }).center(tp1.x, tp1.y);
        //svgGroup.circle(5).fill({ color: 'pink', opacity: 1.0 }).center(tp2.x, tp2.y);
        svgGroup.circle(se1.radius * 2).stroke({ color: 'purple', opacity: 1.0 }).fill({ opacity: 0 }).center(joinVertex.x, joinVertex.y);

        let n0 = Vec2.SUBTRACT(se0.outlineOrigin, joinVertex).normalized();
        let d0 = e0.outgoingDirection;
        let n0tp1 = Vec2.DOT(n0, tp1);
        let n0eo1 = Vec2.DOT(n0, se1.outlineOrigin);
        let d0tp1 = Vec2.DOT(d0, tp1);
        let d0eo1 = Vec2.DOT(d0, se1.outlineOrigin);

        if (se1.isExtension && n0eo1 < n0tp1) {
            // extension
            let p1 = se1.outlineOrigin;

            let outlineOrigin0b = joinVertex.lerp(se0.outlineOrigin, se1.radius / se0.radius);
            t0b = intersectRays(
                outlineOrigin0b,
                e0.outgoingDirection,
                se1.outlineOrigin,
                e1.outgoingDirection)[0];
            let pXb = Vec2.ADD(outlineOrigin0b, e0.outgoingDirection.scaled(t0b));
            const d = Vec2.SUBTRACT(pXb, joinVertex).length();
            const l = arguments.miterLimit * se1.radius;

            let pX0;
            let pX1 = se1.outlineOrigin;
            if (d0eo1 > d0tp1) {
                // take mirror of se1.outlineOrigin relative to se0 centerline
                let v = Vec2.SUBTRACT(se1.outlineOrigin, joinVertex);
                let rv = v.reflect(n0);
                pX0 = Vec2.ADD(joinVertex, rv);
            }
            else {
                pX0 = tp1;
            }


            let bevelDir = Vec2.SUBTRACT(pX0, p0).normalized();
            tX0 = intersectRays(
                p0,
                bevelDir,
                se1.outlineOrigin,
                e1.outgoingDirection)[0];
            pX = Vec2.ADD(p0, bevelDir.scaled(tX0));

            // miter with transition to bevel

            if (d > l) {
                const ld = l / d;
                const t = ld * ld;
                pX0 = pX0.lerp(pX, t);
                pX1 = pX1.lerp(pX, t);

                // isect [pX0, pX1] with [joinVertex, pX]
                const splitSeg = Vec2.SUBTRACT(pX, joinVertex);
                tX = intersectRays(
                    joinVertex,
                    splitSeg,
                    pX0,
                    Vec2.SUBTRACT(pX1, pX0))[0];
                pX = Vec2.ADD(joinVertex, splitSeg.scaled(tX));

                // simple midpoint
                //pX = pX0.midPoint(pX1);
            }


            {
                let a = Vec2.ADD(joinVertex, e0.outgoingDirection.scaled(e0.length));
                let b = Vec2.ADD(e0.outlineOrigins[se0.side], e0.outgoingDirection.scaled(e0.length));
                svgGroup.polyline([a.asArray(), b.asArray(), p0.asArray(), pX0.asArray(), pX.asArray(), joinVertex.asArray()])
                    .fill({ color: e0.color, opacity: 0.5 })
                    .stroke({ color: e0.color, opacity: 1.0, width: globals.inputGeometryStrokeWidth });
            }
            {
                let a = Vec2.ADD(joinVertex, e1.outgoingDirection.scaled(e1.length));
                let b = Vec2.ADD(e1.outlineOrigins[se1.side], e1.outgoingDirection.scaled(e1.length));
                svgGroup.polyline([a.asArray(), b.asArray(), p1.asArray(), pX1.asArray(), pX.asArray(), joinVertex.asArray()])
                    .fill({ color: e1.color, opacity: 0.5 })
                    .stroke({ color: e1.color, opacity: 1.0, width: globals.inputGeometryStrokeWidth });
            }
        }
        else {
            let p0c = tp1;
            let d0c = Vec2.SUBTRACT(p0c, p0);
            t0c = intersectRays(
                p0c,
                d0c,
                se1.outlineOrigin,
                e1.outgoingDirection)[0];

            if (t0c < -1) {
                // overlap
                return false;
            }

            let pXc = Vec2.ADD(p0c, d0c.scaled(t0c));

            //pX0 = Vec2.ADD(joinVertex, n0.scaled(se1.radius));
//
            //let bevelDir = Vec2.SUBTRACT(pX0, p0).normalized();
//
            //tX0 = intersectRays(
            //    p0,
            //    bevelDir,
            //    se1.outlineOrigin,
            //    e1.outgoingDirection)[0];
//
            //pX = Vec2.ADD(p0, bevelDir.scaled(tX0));
//
            const pX = pXc;
            const p1 = pXc;

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
                svgGroup.polyline([a.asArray(), b.asArray(), p1.asArray(), joinVertex.asArray()])
                    .fill({ color: e1.color, opacity: 0.5 })
                    .stroke({ color: e1.color, opacity: 1.0, width: globals.inputGeometryStrokeWidth });
            }
        }

    }

    return true;
}
var allCasesMinRadius3Method = {
    name: "allCasesMinRadius3",
    prettyname: "allCasesMinRadius3",
    function: allCasesMinRadius3,
    parameters: [
        { name: 'miterLimit', prettyName: 'Miter Limit', type: 'range', value: 2, step: 0.001, min: 0, max: 10 },
        { name: 'sharpTruncate', prettyName: 'Miter Limit Clip Sharp', type: 'checkbox', checked: false },
    ]
};
