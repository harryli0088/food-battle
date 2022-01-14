type EntrantType<EntrantDataType> = {
  data: EntrantDataType,
  id: number, //also the index in the array
}

type NodeType = {
  childrenIds: number[] | null,
  entrantId: number | null, //which entrant is in this tournament position (could be empty)
  id: number, //also the index in the array
  level: number, //tournament level, index starting at 0
  parentId: number | null,
  row: number, //row in the level, index starting at 0
}

export default class Tournament<EntrantDataType> {
  entrants: EntrantType<EntrantDataType>[]
  logBase: number //how many entrants face off at a time
  nodes: NodeType[]
  nodeMap: { //maps the level and row of the tournament to respective node id
    [key: string]: number
  }

  constructor(
    entrantsData: EntrantDataType[],
    logBase: number=2
  ) {
    if(entrantsData.length === 0) {
      throw new Error("No entrants data")
    }
    if(logBase < 2) {
      throw new Error("Log Base must be 2 or greater")
    }

    this.logBase = logBase
    this.makeEntrants(entrantsData)
    this.rebuildTournament() //rebuild tournament
  }

  /***************** Entrants /*****************/

  addEntrant = (entrantData: EntrantDataType) => {
    this.entrants.push({
      data: entrantData,
      id: this.entrants.length,
    })

    this.rebuildTournament() //rebuild tournament
  }

  makeEntrants = (entrantsData: EntrantDataType[]) => (
    this.entrants = entrantsData.map((data, i) => ({
      data,
      id: i
    }))
  )

  removeEntrant = (entrantId: number) => {
    this.entrants.splice(entrantId,1) //splice out the entrant
    for(let i=entrantId; i<this.entrants.length; ++i) {
      this.entrants[i].id = i //update all the subsequent ids
    }

    this.rebuildTournament() //rebuild tournament
  }

  /***************** Tournament /*****************/


  rebuildTournament = () => {
    //get the maximum number of tournament levels (including the final victor)
    //log_a(x) = log(x) / log(a)
    const maxLevels = Math.ceil(Math.log(this.entrants.length) / Math.log(this.logBase)) + 1

    //build the first layer of the tournament
    let level = 0
    this.nodes = this.entrants.map((e,i) => ({
      childrenIds: null,
      level,
      entrantId: e.id, //link the entrant id
      id: i, //id of the node
      parentId: null, //to be set later
      row: i, //row in the level
    }))

    let startNodeId = 0 //this is the first node id of the last level
    while(++level < maxLevels) { //move to the next level and check if we still have remaining levels
      let newNode: NodeType | null = null
      let faceOffCount = 0 //track how many nodes are facing off
      let nodeId = startNodeId //get the node id to start at
      let row = 0
      startNodeId = this.nodes.length //move to the next anticipated level's starting node id

      for(nodeId; nodeId<startNodeId; ++nodeId) { //loop through all the nodes in the previous level
        faceOffCount++ //increment the face off count

        if(newNode === null) { //if we are facing off between new entrants
          newNode = {
            childrenIds: [], //to be populated later
            level,
            entrantId: null, //to be populated by the user later
            id: this.nodes.length, //id of the node
            parentId: null, //to be set later
            row, //row in the level
          }

          row++ //increment the row for the next node
        }
        //at this point, newNode should never be null
        newNode.childrenIds.push(nodeId) //mark this node as a child of the newNode
        this.nodes[nodeId].parentId = newNode.id //mark this new node as the parent

        if(faceOffCount >= this.logBase) { //if we have reached the maximum number of entrants facing off
          this.nodes.push(newNode) //push the new node

          faceOffCount = 0 //reset the face off count
          newNode = null //reset the new node
        }
      }
    }

    this.nodeMap = {} //reset the node map
    this.nodes.forEach(n => {
      this.nodeMap[this.getNodeMapKeyFromNode(n)] = n.id
    })
  }


  getNodeIdFromPosition = (level:number, row: number) => this.nodeMap[this.makeNodeMapKey(level, row)]

  getNodeMapKeyFromNode = (node: NodeType) => this.makeNodeMapKey(node.level, node.row)

  makeNodeMapKey = (level:number, row: number) => `${level}-${row}`

  /***************** Selecting and Deselecting Winners /*****************/

  canSelectNodeWinner = (nodeId: number):boolean|Error => {
    const node = this.nodes[nodeId]
    const parent = this.nodes[node.parentId]

    if(parent === undefined) { //if the parent does not exist
      return new Error("The selected node does not have a parent")
    }
    if(node.entrantId === null) { //if an entrant was not yet selected to be the winner at this node
      return new Error("The selected node does not have an entrant")
    }
    return true
  }

  
  selectNodeWinner = (nodeId: number) => {
    const node = this.nodes[nodeId]
    const parent = this.nodes[node.parentId]

    throwIfNotTrue(this.canSelectNodeWinner(nodeId))

    parent.entrantId = node.entrantId //advance the entrant to the next tournament level
  }

  canDeselectNodeWinner = (nodeId: number):boolean|Error => {
    const node = this.nodes[nodeId]

    if(node.entrantId === null) { //if an entrant was not yet selected to be the winner at this node
      return new Error("The selected node does not have an entrant")
    }
    return true
  }

  deselectNodeWinner = (nodeId: number) => {
    const node = this.nodes[nodeId]

    throwIfNotTrue(this.canDeselectNodeWinner(nodeId))

    node.entrantId = null //unset the winning entrant
  }
}


function throwIfNotTrue (result: boolean | Error) {
  if(result !== true) {
    throw result
  }
}
