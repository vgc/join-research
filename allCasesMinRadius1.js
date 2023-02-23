function computeTangentRayToCircle(rayOrigin, center, radius) {

    let d = Vec2.SUBTRACT(rayOrigin, center);
    let n = new Vec2(-d.y, d.x);
    let l = d.length();

    if (radius < 0) {
        radius = -radius;
    }

    if (l < radius) {
        return null;
    }
    else if (radius == 0) {
        return [center, center];
    }
    else if (((l / radius) - 1) < 1E-8) {
        return [rayOrigin, rayOrigin];
    }

    let rho = radius / l;
    let rho2 = rho * rho;
    let ad = rho2;
    let bd = rho * Math.sqrt(1 - rho2);

    let dad = d.scaled(ad);
    let nbd = n.scaled(bd);

    let T1 = Vec2.ADD(center, Vec2.ADD(dad, nbd));
    let T2 = Vec2.ADD(center, Vec2.SUBTRACT(dad, nbd));

    return [T1, T2];
}


function allCasesMinRadius1(svgGroup, se0, se1, arguments) {

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

        let p0 = e0.outlinePoint(se0.side, se0.tCutMax);
        let p1 = se1.outlineOrigin;

        // bevel tangent points
        [tp1, tp2] = computeTangentRayToCircle(p0, joinVertex, se1.radius);
        if (Vec2.DOT(Vec2.SUBTRACT(tp2, joinVertex), e0.outgoingDirection)
            < Vec2.DOT(Vec2.SUBTRACT(tp1, joinVertex), e0.outgoingDirection)) {
            [tp1, tp2] = [tp2, tp1];
        }
        //svgGroup.circle(5).fill({ color: 'purple', opacity: 1.0 }).center(tp1.x, tp1.y);
        //svgGroup.circle(5).fill({ color: 'pink', opacity: 1.0 }).center(tp2.x, tp2.y);
        svgGroup.circle(se1.radius * 2).stroke({ color: 'purple', opacity: 1.0 }).fill({ opacity: 0 }).center(joinVertex.x, joinVertex.y);

        let outlineOrigin0X = joinVertex.lerp(se0.outlineOrigin, se1.radius / se0.radius);
        t0X = intersectRays(
            outlineOrigin0X,
            e0.outgoingDirection,
            se1.outlineOrigin,
            e1.outgoingDirection)[0];
        let pXX = Vec2.ADD(outlineOrigin0X, e0.outgoingDirection.scaled(t0X));

        let pX0 = p0;
        let pX1 = p1;
        let pX = pXX;

        let n0 = Vec2.SUBTRACT(se0.outlineOrigin, joinVertex).normalized();

        if (t0X < 0) {
            // extension

            if (Vec2.DOT(n0, tp1) > Vec2.DOT(n0, se1.outlineOrigin)) {
                // use tangent
                pX1 = se1.outlineOrigin;
                let dir0 = e0.outgoingDirection;
                if (Vec2.DOT(dir0, pX1) > Vec2.DOT(dir0, tp1)) {
                    // take mirror of se1.outlineOrigin relative to se0 centerline
                    let v = Vec2.SUBTRACT(pX1, joinVertex);
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
                const d = Vec2.SUBTRACT(pXX, joinVertex).length();
                const l = arguments.miterLimit * se1.radius;
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

                //pX = joinVertex;
            }
            else {
                pX = se1.outlineOrigin;
                pX0 = pX;
                pX1 = pX;
            }

            const d = Vec2.SUBTRACT(pX, joinVertex).length();
            const l = arguments.miterLimit * se1.radius;

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

            let dir0 = e0.outgoingDirection;

            if (Vec2.DOT(n0, se1.outlineOrigin) > Vec2.DOT(n0, tp1)) {
                // use tangent
                // take mirror of se1.outlineOrigin relative to se0 centerline
                let v = Vec2.SUBTRACT(se1.outlineOrigin, joinVertex);
                let rv = v.reflect(dir0);
                pX0 = Vec2.ADD(joinVertex, rv);



                //pX = tp1;
                //pX = Vec2.ADD(joinVertex, n0.scaled(se1.radius));
            }
            else {
                pX0 = tp1;
            }

            let bevelDir = Vec2.SUBTRACT(pX0, p0);

            tX0 = intersectRays(
                p0,
                bevelDir,
                se1.outlineOrigin,
                e1.outgoingDirection)[0];

            if (tX0 < -1) {
                // overlap
                return false;
            }

            pX = Vec2.ADD(p0, bevelDir.scaled(tX0));

            p1 = pX;

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
var allCasesMinRadius1Method = {
    name: "allCasesMinRadius1",
    prettyname: "allCasesMinRadius1",
    function: allCasesMinRadius1,
    parameters: [
        { name: 'miterLimit', prettyName: 'Miter Limit', type: 'range', value: 2, step: 0.001, min: 0, max: 10 },
        { name: 'sharpTruncate', prettyName: 'Miter Limit Clip Sharp', type: 'checkbox', checked: false },
    ]
};
