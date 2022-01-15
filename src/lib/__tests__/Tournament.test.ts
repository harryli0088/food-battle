import Tournament from "../Tournament";


test("can make a Tournament", () => {
  const tourn = new Tournament<string>(["apple", "banana", "cherry", "dragon fruit"])

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
    { childrenIds: [0,1], entrantId: null, id: 4, level: 1, parentId: 6, row: 0 },
    { childrenIds: [2,3], entrantId: null, id: 5, level: 1, parentId: 6, row: 1 },
    { childrenIds: [4,5], entrantId: null, id: 6, level: 2, parentId: null, row: 0 },
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
});