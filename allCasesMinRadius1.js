function allCasesMinRadius1(svgGroup, se0, se1, arguments) {

    const haveSameRadius = (se0.radius === se1.radius);
    if (se0.radius < se1.radius) {
        [se0, se1] = [se1, se0];
    }
    const e0 = se0.e;
    const e1 = se1.e;

    let p0 = e0.outlinePoint(se0.side, se0.tCutMax);
    let innerOutlineOrigin0 = joinVertex.lerp(se0.outlineOrigin, se1.radius / se0.radius);
    let slopeDir = Vec2.SUBTRACT(p0, innerOutlineOrigin0).normalized();

    //function innerOutlinePoint0(t) {
    //    return
    //}

    t0 = intersectRays(
        innerOutlineOrigin0,
        se0.e.outgoingDirection,
        se1.outlineOrigin,
        se1.e.outgoingDirection)[0];

    let pX = Vec2.ADD(innerOutlineOrigin0, e0.outgoingDirection.scaled(t0));
    let pX0 = innerOutlineOrigin0;
    let pX1 = se1.outlineOrigin;
    let p1 = se1.outlineOrigin;

    if (t0 < 0) {
        // extension

        let pXX = pX;
        if (!haveSameRadius) {
            t0 = intersectRays(
                p0,
                slopeDir,
                se1.outlineOrigin,
                se1.e.outgoingDirection)[0];
            pXX = Vec2.ADD(p0, slopeDir.scaled(t0));
        }
        else {
            p0 = se0.outlineOrigin;
            slopeDir = se0.e.outgoingDirection;
        }

        const d = Vec2.SUBTRACT(pX, joinVertex).length();
        const l = arguments.miterLimit * se1.radius;
        if (d > l) {
            const ld = l / d;
            const pClip = joinVertex.lerp(pX, ld * ld);
            const N = new Vec2(-pClip.y, pClip.x);
            const t0 = intersectRays(pClip, N, innerOutlineOrigin0, slopeDir)[1];
            const t1 = intersectRays(pClip, N, se1.outlineOrigin, se1.e.outgoingDirection)[1];
            const dSplit = Vec2.SUBTRACT(pX, joinVertex);
            const tSplit = intersectRays(pClip, N, joinVertex, dSplit)[1];
            pX = Vec2.ADD(joinVertex, dSplit.scaled(tSplit));
            if (!arguments.sharpTruncate) {
                pX0 = Vec2.ADD(innerOutlineOrigin0, slopeDir.scaled(t0));
                pX1 = se1.e.outlinePoint(se1.side, t1);
            }
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
