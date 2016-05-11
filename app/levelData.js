// Entity data for blocks
var LEVELDATA = [
  {
    'group': 'bricks',
    'dimensions':{ // default dimensions for bricks
      'width': 50,
      'height': 15
    },
    'types': [ // dynamic data, index + 1 is used in entities position
      {
        'color': 'black',
        'health': 1
      },
      {
        'color': 'red',
        'health': 2
      }
    ],
    'entities': [ // location of each type of entity, 0 is no block, 1 is index 0 in types, 2 is index 1, etc...
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ]
  },
  {
    'group': 'bricks',
    'dimensions':{ // default dimensions for bricks
      'width': 50,
      'height': 15
    },
    'types': [ // dynamic data, index + 1 is used in entities position
      {
        'color': 'black',
        'health': 1
      },
      {
        'color': 'red',
        'health': 2
      }
    ],
    'entities': [ // location of each type of entity, 0 is no block, 1 is index 0 in types, 2 is index 1, etc...
      [0,1,2,2,2,1,0],
      [1,2,2,1,2,2,1],
      [0,0,1,1,1,0,0],
      [0,0,1,1,1,0,0]
    ]
  }
]
