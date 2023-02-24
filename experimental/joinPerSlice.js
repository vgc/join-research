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
                se.radius = se.e.radii[se.side];
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
                    let p0 = se0.outlineOrigin;
                    let p1 = se1.outlineOrigin;
                    let pX = e0.outlinePoint(se0.side, se0.t);

                    const d = Vec2.SUBTRACT(pX, joinVertex).length();
                    const l = arguments.miterLimit * Math.max(se0.radius, se1.radius);
                    if (d > l) {
                        const ld = l / d;
                        const t = ld * ld;
                        p0 = p0.lerp(pX, t);
                        p1 = p1.lerp(pX, t);

                        const splitSeg = Vec2.SUBTRACT(pX, joinVertex);
                        tX = intersectRays(
                            joinVertex,
                            splitSeg,
                            p0,
                            Vec2.SUBTRACT(p1, p0))[0];
                        pX = Vec2.ADD(joinVertex, splitSeg.scaled(tX));
                    }

                    // restore p0 and p1 if we want the pointy miter
                    if (arguments.sharpTruncate) {
                        p0 = se0.outlineOrigin;
                        p1 = se1.outlineOrigin;
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
                initialMethodIndex: 9,
                type: 'method',
                methods: [
                    tryExtensionCut0Method,
                    tryExtensionCut1Method,
                    tryExtensionCut2Method,
                    tryExtensionCut3Method,
                    tryExtensionCut4Method,
                    tryExtensionCut5Method,
                    tryExtensionCut6Method,
                    tryExtensionCut7Method,
                    tryExtensionCut8Method,
                    tryExtensionCut9Method,
                    allCasesMinRadius0Method,
                    allCasesMinRadius1Method,
                    allCasesMinRadius2Method,
                    allCasesMinRadius3Method
                ]
            },
            { name: 'miterLimit', prettyName: 'Miter Limit', type: 'range', value: 4, step: 0.001, min: 0, max: 15 },
            { name: 'sharpTruncate', prettyName: 'Miter Limit Clip Sharp', type: 'checkbox', checked: false },
        ]
    };
}