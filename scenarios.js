var scenarios = [
    {
        prettyName: "2 edges of different widths",
        edges: [
            { 'radius': 30, 'angle': 0, 'color': 'blue',
              'angleAnim': [[10, 360], [0, 0], [6, 360], [0, 0], [3, 360], [0, 0], [1, 360]],
              'relRadiusAnim': [[10, 2.5], [0, 1], [10, 2.5]] },
            { 'radius': 200, 'angle': 180, 'color': 'red' },
        ]
    },
    {
        prettyName: "2 edges of same widths",
        edges: [
            { 'radius': 50, 'angle': 0, 'color': 'blue' },
            { 'radius': 50, 'angle': 160, 'color': 'red' },
        ]
    },
    {
        prettyName: "3 edges of different widths",
        edges: [
            { 'radius': 40, 'angle': 0, 'color': 'blue' },
            { 'radius': 100, 'angle': 0, 'color': 'red' },
            { 'radius': 70, 'angle': 1, 'color': 'green' },
        ]
    },
    {
        prettyName: "3 edges: t-junction (narrow onto wide)",
        edges: [
            { 'radius': 40, 'angle': Math.PI / 2, 'color': 'blue' },
            { 'radius': 100.001, 'angle': 0, 'color': 'red' },
            { 'radius': 100, 'angle': Math.PI, 'color': 'green' },
        ]
    },
];