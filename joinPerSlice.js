function joinPerSlice(svgGroup, angleSortedEdges, arguments) {
    for (let i = 0; i < angleSortedEdges.length; ++i) {
        let j = i + 1;
        if (j >= angleSortedEdges.length) {
            j = 0;
        }
        let sliceEdges = [{ e: angleSortedEdges[i], side: Side.Right }, { e: angleSortedEdges[j], side: Side.Left }];
        let intersection = sliceEdges[0].e.outlineIntersections[Side.Right].find(function (a) { return a[0] == j; })
        if (intersection) {
            sliceEdges[0].t = intersection[1];
            sliceEdges[1].t = intersection[2];

            {
                const e = sliceEdges[0].e;
                const a = Vec2.ADD(e.outlineOrigins[Side.Right], e.outgoingDirection.scaled(sliceEdges[0].t));
                svgGroup.circle(6).fill({ color: 'black' }).center(a.x, a.y);
            }

            for (let i = 0; i < 2; ++i) {
                let se = sliceEdges[i];
                se.tCutMax = se.e.tCutMax[se.side];
                se.isExtension = se.t <= 0;
                se.isCut = se.t > 0;
                se.isOvercut = se.t > se.tCutMax;
                se.radius = se.e.radius;
                se.outlineOrigin = se.e.outlineOrigins[se.side];
            }

            let done = false;

            for (let i = 0; !done && i < 2; ++i) {
                let se0 = sliceEdges[i];
                let se1 = sliceEdges[1 - i];

                methodData = arguments.extensionCutMethod.methodsData[arguments.extensionCutMethod.selectedMethodIndex];
                done = methodData.description.function(svgGroup, se0, se1, methodData.arguments);
            }

            if (!done) {
                let se0 = sliceEdges[0];
                let se1 = sliceEdges[1];
                if (se0.isExtension && se1.isExtension) {
                    const e0 = se0.e;
                    const e1 = se1.e;
                    let pX0 = se0.e.outlinePoint(se0.side, se0.t);
                    let pXM = pX0;
                    let pX1 = pX0;
                    const d = Vec2.SUBTRACT(pX0, joinVertex).length();
                    const l = arguments.miterLimit * Math.max(se0.radius, se1.radius);
                    if (d > l) {
                        const ld = l / d;
                        const pX = joinVertex.lerp(pX0, ld * ld);
                        const savedPX0 = new Vec2(pX0);
                        const N = new Vec2(-pX.y, pX.x);
                        const t0 = intersectRays(pX, N, se0.outlineOrigin, se0.e.outgoingDirection)[1];
                        const t1 = intersectRays(pX, N, se1.outlineOrigin, se1.e.outgoingDirection)[1];
                        if (arguments.sharpTruncate) {
                            pX0 = se0.outlineOrigin;
                            pX1 = se1.outlineOrigin;
                        }
                        else {
                            pX0 = se0.e.outlinePoint(se0.side, Math.min(t0, 0));
                            pX1 = se1.e.outlinePoint(se1.side, Math.min(t1, 0));
                        }
                        pXM = pX;
                    }
                    {
                        let a = Vec2.ADD(joinVertex, e0.outgoingDirection.scaled(e0.length));
                        let b = Vec2.ADD(e0.outlineOrigins[se0.side], e0.outgoingDirection.scaled(e0.length));
                        svgGroup.polyline([a.asArray(), b.asArray(), pX0.asArray(), pXM.asArray(), joinVertex.asArray()])
                            .fill({ color: e0.color, opacity: 0.5 })
                            .stroke({ color: e0.color, opacity: 1.0, width: globals.inputGeometryStrokeWidth });
                    }
                    {
                        let a = Vec2.ADD(joinVertex, e1.outgoingDirection.scaled(e1.length));
                        let b = Vec2.ADD(e1.outlineOrigins[se1.side], e1.outgoingDirection.scaled(e1.length));
                        svgGroup.polyline([a.asArray(), b.asArray(), pX1.asArray(), pXM.asArray(), joinVertex.asArray()])
                            .fill({ color: e1.color, opacity: 0.5 })
                            .stroke({ color: e1.color, opacity: 1.0, width: globals.inputGeometryStrokeWidth });
                    }
                    done = true;
                }
                else if (se0.isCut && se1.isCut && !se0.isOvercut && !se1.isOvercut) {
                    const e0 = se0.e;
                    const e1 = se1.e;
                    let pX = se0.e.outlinePoint(se0.side, se0.t);
                    {
                        let a = Vec2.ADD(joinVertex, e0.outgoingDirection.scaled(e0.length));
                        let b = Vec2.ADD(e0.outlineOrigins[se0.side], e0.outgoingDirection.scaled(e0.length));
                        svgGroup.polyline([a.asArray(), b.asArray(), pX.asArray(), joinVertex.asArray()])
                            .fill({ color: e0.color, opacity: 0.5 })
                            .stroke({ color: e0.color, opacity: 1.0, width: globals.inputGeometryStrokeWidth });
                    }
                    {
                        let a = Vec2.ADD(joinVertex, e1.outgoingDirection.scaled(e1.length));
                        let b = Vec2.ADD(e1.outlineOrigins[se1.side], e1.outgoingDirection.scaled(e1.length));
                        svgGroup.polyline([a.asArray(), b.asArray(), pX.asArray(), joinVertex.asArray()])
                            .fill({ color: e1.color, opacity: 0.5 })
                            .stroke({ color: e1.color, opacity: 1.0, width: globals.inputGeometryStrokeWidth });
                    }
                    done = true;
                }
            }
        }
    }
}
function joinPerSliceMethodDescription() {
    return {
        name: "PerSlice",
        prettyName: "Per Slice",
        function: joinPerSlice,
        parameters: [
            {
                name: 'extensionCutMethod',
                prettyName: 'Extension+Cut Slice Method',
                initialMethodIndex: 4,
                type: 'method',
                methods: [
                    tryExtensionCut0Method,
                    tryExtensionCut1Method,
                    tryExtensionCut2Method,
                    tryExtensionCut3Method,
                    tryExtensionCut4Method
                ]
            },
            { name: 'miterLimit', prettyName: 'Miter Limit', type: 'range', value: 2, step: 0.001, min: 0, max: 10 },
            { name: 'sharpTruncate', prettyName: 'Miter Limit Clip Sharp', type: 'checkbox', checked: false },

        ]
    };
}