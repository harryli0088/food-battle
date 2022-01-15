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
  base: number //how many entrants face off at a time
  entrants: EntrantType<EntrantDataType>[]
  nodes: NodeType[]
  nodeMap: { //maps the level and row of the tournament to respective node id
    [key: string]: number
  }

  constructor(
    entrantsData: EntrantDataType[],
    base: number=2
  ) {
    if(entrantsData.length === 0) {
      throw new Error("No entrants data")
    }
    if(base < 2) {
      throw new Error("Log Base must be 2 or greater")
    }

    this.base = base
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
    this.nodes = this.entrants.map((e,i) => ({
      childrenIds: null,
      entrantId: e.id, //link the entrant id
      id: i, //id of the node
      level: 0,
      parentId: null, //to be set later
      row: i, //row in the level
    }))

    //initialize a queue of nodes 
    let nodeQueue: NodeType[] = [...this.nodes]

    let level:number = 0
    while(nodeQueue.length > 1) { //while there are more than one nodes in the queue, ie we should make a new level
      //if the initial number of entrants is not an exact power of the base
      //have the entrants face off against each other until we get to an exact power of the base
      const powerRemainder = nodeQueue.length - powerRoundDown(nodeQueue.length, this.base)
      const isPowerRemainder = powerRemainder > 0 //if there is a power remainder (ie the number of tournament entrants is uneven)
      
      //the number of new nodes to make in this level
      const numNewNodes = isPowerRemainder ? powerRemainder : (nodeQueue.length / this.base)
      let row = 0
      const tmpNewNodeQueue: NodeType[] = []
      for(let i=0; i<numNewNodes; ++i) { //make all the new nodes
        const newNode = { //create a new node
          childrenIds: [], //to be populated later
          entrantId: null, //to be populated by the user later
          id: this.nodes.length, //id of the node
          level: level + 1,
          parentId: null, //to be set later
          row: i, //row in the level
        }

        for(let j=0; j<this.base; ++j) { //assign all the children to the new node
          const node = nodeQueue.shift() //shift the child node out of the queue
          node.level = level //assign the level
          node.row = row //assign the row
          row++ //increment to the next row

          newNode.childrenIds.push(node.id) //mark this node as a child of the newNode
          this.nodes[node.id].parentId = newNode.id //mark this new node as the parent
        }
  
        this.nodes.push(newNode) //push the new node into

        if(isPowerRemainder) { //if the the number of tournament entrants is uneven
          //we want to add the new nodes in front of what will be the remaining nodes in the queue
          tmpNewNodeQueue.push(newNode)
        }
        else {
          nodeQueue.push(newNode) //add the new node to the queue
        }
      }
      nodeQueue = tmpNewNodeQueue.concat(nodeQueue)

      level++
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

/**
 * if the input is not exactly true, throw the input, else do nothing
 * @param input 
 */
function throwIfNotTrue (input: boolean | Error) {
  if(input !== true) {
    throw input
  }
}

/**
 * given a value and a base, return the next lower power of the base
 * ie, value of 7, power 2, returns 4
 * value of 10, power of 2, returns 8
 * @param value 
 * @param base  
 * @returns     return the next lower power of the base
 */
function powerRoundDown(value: number, base: number) {
  const power = Math.floor(Math.log(value) / Math.log(base))
  return Math.pow(base, power)
}
