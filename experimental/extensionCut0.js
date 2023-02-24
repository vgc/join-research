// Algorithm: PerSlice/ExtensionCut
// Applies to case: (extension, cut)
//
// Legend
// ------------------
// ◆: common vertex
// ┈: center line
// ━: outline
// │: raw edge end
// x: intersection
// o: max cut point
//
// Sub-cases
// ------------------
// 	━━━┑╌╌╌x           (1)
//     ┝━━━x━━o━━━━━━
//  A┈┈◆┈┈┈┈┈┈┈┈┈┈┈┈B
//
// 	━━━┑╌╌╌╌╌╌╌╌╌x     (2)
//     ┝━━━━━━o━━x━━━
//  A┈┈◆┈┈┈┈┈┈┈┈┈┈┈┈B
//
// 	━━━━━o━━x━━━━┑     (3)
//          x╌╌╌╌┝━━━
//  A┈┈┈┈┈┈┈┈┈┈┈┈◆┈┈B
//
// 	━━x━━o━━━━━━━┑     (4)
//    x╌╌╌╌╌╌╌╌╌╌┝━━━
//  A┈┈┈┈┈┈┈┈┈┈┈┈◆┈┈B
//

function tryExtensionCut0(svgGroup, se0, se1, arguments) {
    if (se0.isExtension && se1.isCut) {
        const e0 = se0.e;
        const e1 = se1.e;
        let p0 = e0.outlinePoint(se0.side, se0.tCutMax);
        let p1 = e1.outlinePoint(se1.side, Math.min(se1.t, se1.tCutMax));
        let p2 = p0.lerp(p1, se0.tCutMax / (se0.tCutMax + se1.tCutMax));

        // Let pX a point on [p0, p1] and [joinVertex, pX] be the segment that splits
        // the join in two halves (to have different colors).
        // We want pX to be at the orthogonal of the cut edge at the join vertex when:
        // - cut t is 0 (px == p1)
        // - the edges are colinear (px == p2)
        //
        let cutRatio = se1.isOvercut ? 1 : se1.t / se1.tCutMax;
        let pX = p1.lerp(p2, cutRatio);

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
var tryExtensionCut0Method = {
    name: "ExtensionCut0",
    function: tryExtensionCut0
};