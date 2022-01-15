import Tournament from "../Tournament";


test("can make a Tournament", () => {
  const tourn = new Tournament<string>(["apple", "banana", "cherry", "dragon fruit"])

  expect(tourn.levels).toEqual(3)

  expect(tourn.entrants).toEqual([
    {data: "apple", id: 0},
    {data: "banana", id: 1},
    {data: "cherry", id: 2},
    {data: "dragon fruit", id: 3},
  ])
  
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 4, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 4, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 0, parentId: 5, row: 2 },
    { childrenIds: null, entrantId: 3, id: 3, level: 0, parentId: 5, row: 3 },
    { childrenIds: {0: true, 1: true}, entrantId: null, id: 4, level: 1, parentId: 6, row: 0 },
    { childrenIds: {2: true, 3: true}, entrantId: null, id: 5, level: 1, parentId: 6, row: 1 },
    { childrenIds: {4: true, 5: true}, entrantId: null, id: 6, level: 2, parentId: null, row: 0 },
  ])

  expect(tourn.nodeMap).toEqual({
    "0-0": 0,
    "0-1": 1,
    "0-2": 2,
    "0-3": 3,
    "1-0": 4,
    "1-1": 5,
    "2-0": 6,
  })
})

test("can create a tournament with uneven entrants, 5 entrants, base 2", () => {
  const tourn = new Tournament<string>(["apple", "banana", "cherry", "dragon fruit", "elderberry"])

  expect(tourn.levels).toEqual(4)

  expect(tourn.entrants).toEqual([
    {data: "apple", id: 0},
    {data: "banana", id: 1},
    {data: "cherry", id: 2},
    {data: "dragon fruit", id: 3},
    {data: "elderberry", id: 4},
  ])
  
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 5, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 5, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 1, parentId: 6, row: 1 },
    { childrenIds: null, entrantId: 3, id: 3, level: 1, parentId: 7, row: 2 },
    { childrenIds: null, entrantId: 4, id: 4, level: 1, parentId: 7, row: 3 },
    { childrenIds: {0: true, 1: true}, entrantId: null, id: 5, level: 1, parentId: 6, row: 0 },
    { childrenIds: {2: true, 5: true}, entrantId: null, id: 6, level: 2, parentId: 8, row: 0 },
    { childrenIds: {3: true, 4: true}, entrantId: null, id: 7, level: 2, parentId: 8, row: 1 },
    { childrenIds: {6: true, 7: true}, entrantId: null, id: 8, level: 3, parentId: null, row: 0 },
  ])

  expect(tourn.nodeMap).toEqual({
    "0-0": 0,
    "0-1": 1,
    "1-0": 5,
    "1-1": 2,
    "1-2": 3,
    "1-3": 4,
    "2-0": 6,
    "2-1": 7,
    "3-0": 8,
  })
})


test("7 entrants, base 2", () => {
  const tourn = new Tournament<string>(["apple", "banana", "cherry", "dragon fruit", "elderberry", "fig", "grape"])

  expect(tourn.levels).toEqual(4)

  expect(tourn.entrants).toEqual([
    {data: "apple", id: 0},
    {data: "banana", id: 1},
    {data: "cherry", id: 2},
    {data: "dragon fruit", id: 3},
    {data: "elderberry", id: 4},
    {data: "fig", id: 5},
    {data: "grape", id: 6},
  ])
  
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 7, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 7, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 0, parentId: 8, row: 2 },
    { childrenIds: null, entrantId: 3, id: 3, level: 0, parentId: 8, row: 3 },
    { childrenIds: null, entrantId: 4, id: 4, level: 0, parentId: 9, row: 4 },
    { childrenIds: null, entrantId: 5, id: 5, level: 0, parentId: 9, row: 5 },
    { childrenIds: null, entrantId: 6, id: 6, level: 1, parentId: 11, row: 3 },
    { childrenIds: {0: true, 1: true}, entrantId: null, id: 7, level: 1, parentId: 10, row: 0 },
    { childrenIds: {2: true, 3: true}, entrantId: null, id: 8, level: 1, parentId: 10, row: 1 },
    { childrenIds: {4: true, 5: true}, entrantId: null, id: 9, level: 1, parentId: 11, row: 2 },
    { childrenIds: {7: true, 8: true}, entrantId: null, id: 10, level: 2, parentId: 12, row: 0 },
    { childrenIds: {6: true, 9: true}, entrantId: null, id: 11, level: 2, parentId: 12, row: 1 },
    { childrenIds: {10: true, 11: true}, entrantId: null, id: 12, level: 3, parentId: null, row: 0 },
  ])

  expect(tourn.nodeMap).toEqual({
    "0-0": 0,
    "0-1": 1,
    "0-2": 2,
    "0-3": 3,
    "0-4": 4,
    "0-5": 5,
    "1-0": 7,
    "1-1": 8,
    "1-2": 9,
    "1-3": 6,
    "2-0": 10,
    "2-1": 11,
    "3-0": 12,
  })
})


test("add entrant", () => { //(ie, make tourn with even entrants, then add more)
  const tourn = new Tournament<string>(["apple", "banana", "cherry", "dragon fruit"])
  tourn.addEntrant("elderberry")

  expect(tourn.levels).toEqual(4)

  expect(tourn.entrants).toEqual([
    {data: "apple", id: 0},
    {data: "banana", id: 1},
    {data: "cherry", id: 2},
    {data: "dragon fruit", id: 3},
    {data: "elderberry", id: 4},
  ])
  
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 5, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 5, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 1, parentId: 6, row: 1 },
    { childrenIds: null, entrantId: 3, id: 3, level: 1, parentId: 7, row: 2 },
    { childrenIds: null, entrantId: 4, id: 4, level: 1, parentId: 7, row: 3 },
    { childrenIds: {0: true, 1: true}, entrantId: null, id: 5, level: 1, parentId: 6, row: 0 },
    { childrenIds: {2: true, 5: true}, entrantId: null, id: 6, level: 2, parentId: 8, row: 0 },
    { childrenIds: {3: true, 4: true}, entrantId: null, id: 7, level: 2, parentId: 8, row: 1 },
    { childrenIds: {6: true, 7: true}, entrantId: null, id: 8, level: 3, parentId: null, row: 0 },
  ])

  expect(tourn.nodeMap).toEqual({
    "0-0": 0,
    "0-1": 1,
    "1-0": 5,
    "1-1": 2,
    "1-2": 3,
    "1-3": 4,
    "2-0": 6,
    "2-1": 7,
    "3-0": 8,
  })
})


test("remove entrant", () => {
  const tourn = new Tournament<string>(["apple", "banana", "cherry", "dragon fruit", "elderberry"])
  tourn.removeEntrant(4)
  
  expect(tourn.levels).toEqual(3)

  expect(tourn.entrants).toEqual([
    {data: "apple", id: 0},
    {data: "banana", id: 1},
    {data: "cherry", id: 2},
    {data: "dragon fruit", id: 3},
  ])
  
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 4, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 4, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 0, parentId: 5, row: 2 },
    { childrenIds: null, entrantId: 3, id: 3, level: 0, parentId: 5, row: 3 },
    { childrenIds: {0: true, 1: true}, entrantId: null, id: 4, level: 1, parentId: 6, row: 0 },
    { childrenIds: {2: true, 3: true}, entrantId: null, id: 5, level: 1, parentId: 6, row: 1 },
    { childrenIds: {4: true, 5: true}, entrantId: null, id: 6, level: 2, parentId: null, row: 0 },
  ])

  expect(tourn.nodeMap).toEqual({
    "0-0": 0,
    "0-1": 1,
    "0-2": 2,
    "0-3": 3,
    "1-0": 4,
    "1-1": 5,
    "2-0": 6,
  })
})


test("getNodeIdFromPosition", () => {
  const tourn = new Tournament<string>(["apple", "banana", "cherry", "dragon fruit"])

  expect(tourn.getNodeIdFromPosition(0,0)).toEqual(0)
  expect(tourn.getNodeIdFromPosition(0,1)).toEqual(1)
  expect(tourn.getNodeIdFromPosition(0,2)).toEqual(2)
  expect(tourn.getNodeIdFromPosition(0,3)).toEqual(3)
  expect(tourn.getNodeIdFromPosition(1,0)).toEqual(4)
  expect(tourn.getNodeIdFromPosition(1,1)).toEqual(5)
  expect(tourn.getNodeIdFromPosition(2,0)).toEqual(6)
})


test("selectNodeWinner success", () => {
  const tourn = new Tournament<string>(["apple", "banana", "cherry", "dragon fruit"])

  tourn.selectNodeWinner(0) //apple
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 4, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 4, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 0, parentId: 5, row: 2 },
    { childrenIds: null, entrantId: 3, id: 3, level: 0, parentId: 5, row: 3 },
    { childrenIds: {0: true, 1: true}, entrantId: 0, id: 4, level: 1, parentId: 6, row: 0 }, //apple
    { childrenIds: {2: true, 3: true}, entrantId: null, id: 5, level: 1, parentId: 6, row: 1 },
    { childrenIds: {4: true, 5: true}, entrantId: null, id: 6, level: 2, parentId: null, row: 0 },
  ])

  tourn.selectNodeWinner(3) //dragon fruit
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 4, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 4, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 0, parentId: 5, row: 2 },
    { childrenIds: null, entrantId: 3, id: 3, level: 0, parentId: 5, row: 3 },
    { childrenIds: {0: true, 1: true}, entrantId: 0, id: 4, level: 1, parentId: 6, row: 0 }, //apple
    { childrenIds: {2: true, 3: true}, entrantId: 3, id: 5, level: 1, parentId: 6, row: 1 }, //dragonfurit
    { childrenIds: {4: true, 5: true}, entrantId: null, id: 6, level: 2, parentId: null, row: 0 },
  ])

  tourn.selectNodeWinner(4) //apple
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 4, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 4, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 0, parentId: 5, row: 2 },
    { childrenIds: null, entrantId: 3, id: 3, level: 0, parentId: 5, row: 3 },
    { childrenIds: {0: true, 1: true}, entrantId: 0, id: 4, level: 1, parentId: 6, row: 0 }, //apple
    { childrenIds: {2: true, 3: true}, entrantId: 3, id: 5, level: 1, parentId: 6, row: 1 }, //dragonfurit
    { childrenIds: {4: true, 5: true}, entrantId: 0, id: 6, level: 2, parentId: null, row: 0 }, //apple
  ])
})

test("invalid selectNodeWinner", () => {
  const tourn = new Tournament<string>(["apple", "banana", "cherry", "dragon fruit"])

  expect(() => {
    tourn.selectNodeWinner(4) //invalid
  }).toThrowError("The selected node does not have an entrant")

  expect(() => {
    tourn.selectNodeWinner(6) //invalid
  }).toThrowError("The selected node does not have a parent")


  tourn.selectNodeWinner(0) //apple

  expect(() => {
    tourn.selectNodeWinner(4) //invalid
  }).toThrowError("The selected node's parent must have children with entrants")
})


test("deselectNodeWinner success", () => {
  const tourn = new Tournament<string>(["apple", "banana", "cherry", "dragon fruit"])
  tourn.selectNodeWinner(0) //apple
  tourn.selectNodeWinner(3) //dragon fruit
  tourn.selectNodeWinner(4) //apple

  tourn.deselectNodeWinner(6)
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 4, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 4, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 0, parentId: 5, row: 2 },
    { childrenIds: null, entrantId: 3, id: 3, level: 0, parentId: 5, row: 3 },
    { childrenIds: {0: true, 1: true}, entrantId: 0, id: 4, level: 1, parentId: 6, row: 0 },
    { childrenIds: {2: true, 3: true}, entrantId: 3, id: 5, level: 1, parentId: 6, row: 1 },
    { childrenIds: {4: true, 5: true}, entrantId: null, id: 6, level: 2, parentId: null, row: 0 }, //deselected
  ])

  tourn.deselectNodeWinner(4)
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 4, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 4, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 0, parentId: 5, row: 2 },
    { childrenIds: null, entrantId: 3, id: 3, level: 0, parentId: 5, row: 3 },
    { childrenIds: {0: true, 1: true}, entrantId: null, id: 4, level: 1, parentId: 6, row: 0 }, //deselected
    { childrenIds: {2: true, 3: true}, entrantId: 3, id: 5, level: 1, parentId: 6, row: 1 },
    { childrenIds: {4: true, 5: true}, entrantId: null, id: 6, level: 2, parentId: null, row: 0 },
  ])

  tourn.deselectNodeWinner(5)
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 4, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 4, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 0, parentId: 5, row: 2 },
    { childrenIds: null, entrantId: 3, id: 3, level: 0, parentId: 5, row: 3 },
    { childrenIds: {0: true, 1: true}, entrantId: null, id: 4, level: 1, parentId: 6, row: 0 },
    { childrenIds: {2: true, 3: true}, entrantId: null, id: 5, level: 1, parentId: 6, row: 1 }, //deselected
    { childrenIds: {4: true, 5: true}, entrantId: null, id: 6, level: 2, parentId: null, row: 0 },
  ])
})

test("invalid deselectNodeWinner", () => {
  const tourn = new Tournament<string>(["apple", "banana", "cherry", "dragon fruit"])
  tourn.selectNodeWinner(0) //apple
  tourn.selectNodeWinner(3) //dragon fruit

  expect(() => {
    tourn.deselectNodeWinner(0) //invalid
  }).toThrowError("You must first deselect the node winner for the parent")

  expect(() => {
    tourn.deselectNodeWinner(6) //invalid
  }).toThrowError("The selected node does not have an entrant")
})


test("tourn with different base, 9 entrants, base 3", () => {
  const tourn = new Tournament<string>(
    ["apple", "banana", "cherry", "dragon fruit", "elderberry", "fig", "grape", "honeydew", "ichigo"],
    3
  )

  expect(tourn.levels).toEqual(3)

  expect(tourn.entrants).toEqual([
    {data: "apple", id: 0},
    {data: "banana", id: 1},
    {data: "cherry", id: 2},
    {data: "dragon fruit", id: 3},
    {data: "elderberry", id: 4},
    {data: "fig", id: 5},
    {data: "grape", id: 6},
    {data: "honeydew", id: 7},
    {data: "ichigo", id: 8},
  ])
  
  expect(tourn.nodes).toEqual([
    { childrenIds: null, entrantId: 0, id: 0, level: 0, parentId: 9, row: 0 },
    { childrenIds: null, entrantId: 1, id: 1, level: 0, parentId: 9, row: 1 },
    { childrenIds: null, entrantId: 2, id: 2, level: 0, parentId: 9, row: 2 },
    { childrenIds: null, entrantId: 3, id: 3, level: 0, parentId: 10, row: 3 },
    { childrenIds: null, entrantId: 4, id: 4, level: 0, parentId: 10, row: 4 },
    { childrenIds: null, entrantId: 5, id: 5, level: 0, parentId: 10, row: 5 },
    { childrenIds: null, entrantId: 6, id: 6, level: 0, parentId: 11, row: 6 },
    { childrenIds: null, entrantId: 7, id: 7, level: 0, parentId: 11, row: 7 },
    { childrenIds: null, entrantId: 8, id: 8, level: 0, parentId: 11, row: 8 },
    { childrenIds: {0: true, 1: true, 2: true}, entrantId: null, id: 9, level: 1, parentId: 12, row: 0 },
    { childrenIds: {3: true, 4: true, 5: true}, entrantId: null, id: 10, level: 1, parentId: 12, row: 1 },
    { childrenIds: {6: true, 7: true, 8: true}, entrantId: null, id: 11, level: 1, parentId: 12, row: 2 },
    { childrenIds: {9: true, 10: true, 11: true}, entrantId: null, id: 12, level: 2, parentId: null, row: 0 },
  ])

  expect(tourn.nodeMap).toEqual({
    "0-0": 0,
    "0-1": 1,
    "0-2": 2,
    "0-3": 3,
    "0-4": 4,
    "0-5": 5,
    "0-6": 6,
    "0-7": 7,
    "0-8": 8,
    "1-0": 9,
    "1-1": 10,
    "1-2": 11,
    "2-0": 12,
  })
})