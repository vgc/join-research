var scenarios = [
    {
        prettyName: "2 edges of different widths",
        edges: [
            { 'radius': 30, 'angle': 0, 'color': 'blue',
              'angleAnim': [[10, 360], [0, 0]],
              'relRadiusAnim': [[10, 2.5], [0, 1], [10, 2.5]] },
            { 'radius': 200, 'angle': 180, 'color': 'red' },
        ]
    },
    {
        prettyName: "2 edges of same widths",
        edges: [
            { 'radius': 50, 'angle': 0, 'color': 'blue',
              'angleAnim': [[10, 360], [0, 0]] },
            { 'radius': 50, 'angle': 160, 'color': 'red' },
        ]
    },
    {
        prettyName: "3 edges of different widths",
        edges: [
            { 'radius': 40, 'angle': 0, 'color': 'blue',
              'angleAnim': [[10, 360], [0, 0]] },
            { 'radius': 100, 'angle': 80, 'color': 'red' },
            { 'radius': 70, 'angle': 210, 'color': 'green' },
        ]
    },
    {
        prettyName: "3 edges: t-junction (narrow onto wide)",
        edges: [
            { 'radius': 40, 'angle': 70, 'color': 'blue',
              'angleAnim': [[5, 110], [5, 70]] },
            { 'radius': 100.001, 'angle': 0, 'color': 'red' },
            { 'radius': 100, 'angle': 180, 'color': 'green' },
        ]
    },
];