function drawAllOutlineIntersections(svgGroup, angleSortedEdges, arguments) {
    const opacity = 0.7;
    for (const e of angleSortedEdges) {
        for (const s of sides) {
            const origin = e.outlineOrigins[s]
            const tMin = e.outlineIntersections[s][0][1]
            const tMax = e.outlineIntersections[s].slice(-1)[1]
            if (tMin < 0) {
                const endpoint = Vec2.ADD(origin, e.outgoingDirection.scaled(tMin));
                svgGroup.line([origin.asArray(), endpoint.asArray()])
                    .stroke({ color: e.color, opacity: opacity, width: globals.inputGeometryStrokeWidth })
                    .attr('stroke-dasharray', "8 1");
            }
            if (tMax > 0) {
                const endpoint = Vec2.ADD(origin, e.outgoingDirection.scaled(tMax));
                svgGroup.line([origin.asArray(), endpoint.asArray()])
                    .stroke({ color: e.color, opacity: opacity, width: globals.inputGeometryStrokeWidth })
                    .attr('stroke-dasharray', "8 1");
            }
        }
        for (intersect of e.outlineIntersections[Side.Left]) {
            const a = Vec2.ADD(e.outlineOrigins[Side.Left], e.outgoingDirection.scaled(intersect[1]));
            svgGroup.circle(5).fill({ color: e.color, opacity: 1.0 }).center(a.x, a.y);
        }

        {
            let a = e.outlinePoint(Side.Left, e.tCutMax[Side.Left]);
            let b = e.outlinePoint(Side.Left, e.length);
            let c = e.outlinePoint(Side.Right, e.length);
            let d = e.outlinePoint(Side.Right, e.tCutMax[Side.Right]);
            svgGroup.polyline([a.asArray(), b.asArray(), c.asArray(), d.asArray()])
                .fill({ color: e.color, opacity: opacity })
                .stroke({ color: e.color, opacity: opacity, width: globals.inputGeometryStrokeWidth });
            svgGroup.line([a.asArray(), e.outlineOrigins[Side.Left].asArray()])
                .stroke({ color: e.color, opacity: opacity, width: globals.inputGeometryStrokeWidth })
                .attr('stroke-dasharray', "2 2");
            svgGroup.line([d.asArray(), e.outlineOrigins[Side.Right].asArray()])
                .stroke({ color: e.color, opacity: opacity, width: globals.inputGeometryStrokeWidth })
                .attr('stroke-dasharray', "2 2");
        }
    }
}