<script lang="ts">
  import Fa from 'svelte-fa'
  import { faGithub } from '@fortawesome/free-brands-svg-icons'

  import Blanchor from '$lib/Blanchor.svelte';
  import type Tournament from '$lib/Tournament'
  import { NodeType, powerRoundUp } from '$lib/Tournament';
  import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons'

  type NodeDimensionsType = {
    t: number, //top margin
    b: number, //bottom margin
    l: number, //left margin
    r: number, //right
    h: number, //height
    w: number, //width
  }

  export let tournament: Tournament<string>
  export let nodeDims: NodeDimensionsType = {t: 10, b: 10, l: 15, r: 15, h: 50, w: 100}

  $: totalNodeWidth = nodeDims.l + nodeDims.r + nodeDims.w //horizontal space that one node takes up, ie level width
  $: totalNodeHeight = nodeDims.t + nodeDims.b + nodeDims.h //vertical space that one node takes up

  $: maxNodesInLevel = powerRoundUp(tournament.entrants.length, tournament.base)

  $: containerHeight = maxNodesInLevel * totalNodeHeight //height of one level
  $: containerWidth = tournament.levels * totalNodeWidth //sum of widths of all the levels

  $: renderNodeData = tournament.nodes.map(node => {
    const nodesInLevel = Math.pow(tournament.base, tournament.levels - 1 - node.level)
    const levelHeightDivision = containerHeight / nodesInLevel

    const left = node.level * totalNodeWidth + nodeDims.l
    const top = node.row * levelHeightDivision + nodeDims.t + levelHeightDivision/2 - totalNodeHeight/2


    const parent = tournament.nodes[node.parentId]
    const winnerDecided = typeof node.entrantId==="number" && typeof parent?.entrantId==="number"
    return {
      canDeselectNodeWinner: tournament.canDeselectNodeWinner(node)===true,
      canSelectNodeWinner: tournament.canSelectNodeWinner(node)===true,
      left,
      loser: winnerDecided && parent.entrantId !== node.entrantId,
      node,
      top,
      winner: winnerDecided && parent.entrantId === node.entrantId,
    }
  })
  
  $: console.log("renderNodeData",renderNodeData)

  function deselectNodeWinner(node: NodeType) {
    if(tournament.canDeselectNodeWinner(node)) {
      tournament.deselectNodeWinner(node.id)
      tournament = tournament
    }
  }
  function selectNodeWinner(node: NodeType) {
    if(tournament.canSelectNodeWinner(node)) {
      tournament.selectNodeWinner(node.id)
      tournament = tournament
    }
  }

  $: halfNodeHeight = nodeDims.h / 2
  $: halfNodeWidth = nodeDims.w / 2

  //TODO add entrant
  //TODO remove entrant
</script>

<div class="tournament">
  <div>
    <h1>Food Tournament!</h1>
    <p>Decide what to eat, one match at a time</p>
  </div>

  <svg height={containerHeight} width={containerWidth}>
    <g>
      {#each renderNodeData as n}
        {#if n.node.childrenIds}
          {#each Object.keys(n.node.childrenIds).map(id => renderNodeData[id]) as childNodeData}
            <path 
              class={
                "link"
                + (childNodeData.winner ? " winner-link" : "")
                + (childNodeData.loser ? " loser-link" : "")
              }
              d={`M${n.left},${n.top+halfNodeHeight} ${childNodeData.left + nodeDims.w},${childNodeData.top+halfNodeHeight}Z`}
              stroke="#000"
              stroke-width="2"
            />
          {/each}
        {/if}
      {/each}
    </g>
    <g>
      {#each renderNodeData as n}
        <g 
          class={
            "node"
            + (n.canSelectNodeWinner ? " can-select-winner" : "")
            + (n.loser ? " loser-node" : "")
            + (typeof n.node.entrantId === "number" ? " has-entrant" : " no-entrant")
          }

          transform={`translate(${n.left},${n.top})`}
        >
          <g transform={`translate(${halfNodeWidth},${halfNodeHeight})`}>
            <rect
              fill="#eee"
              height={nodeDims.h}
              on:click={() => selectNodeWinner(n.node)}
              width={nodeDims.w}
              x={-halfNodeWidth}
              y={-halfNodeHeight}
            />
          </g>
          <text
            dy="0.35em"
            on:click={() => selectNodeWinner(n.node)}
            text-anchor="middle"
            x={halfNodeWidth}
            y={halfNodeHeight}
          >
            {tournament.entrants[n.node.entrantId]?.data || ""}
          </text>

          {#if n.canDeselectNodeWinner}
            <foreignObject x={- 15} y={halfNodeHeight - 15} height="30" width="30">
              <div class="tournament-icon-container">
                <button class="tournament-icon" on:click={() => deselectNodeWinner(n.node)}>
                  <Fa icon={faTimes}/>
                </button>
              </div>
            </foreignObject>
          {/if}

          <!-- {#if n.canSelectNodeWinner}
            <foreignObject x={nodeDims.w - 15} y={halfNodeHeight - 15} height="30" width="30">
              <div class="tournament-icon-container">
                <button class="tournament-icon" on:click={() => selectNodeWinner(n.node)}>
                  <Fa icon={faArrowRight}/>
                </button>
              </div>
            </foreignObject>
          {/if} -->
        </g>
      {/each}
    </g>
  </svg>

  <form>
    <label for="add-option"><b>Add Another Option</b></label>
    <br/>
    <input
      id="add-option"
      placeholder="Ex: Pizza"
      type="text"
    />
    <button type="submit">Add</button>
  </form>
</div>

<style>
  .tournament {
    height: 100%;
    background-color: #717D7E;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    color: white;
    text-align: center;
  }

  .link {
    transition: 0.5s;
  }
  .link.loser-link {
    opacity: 0.2;
  }



  .node rect {
    fill: #eee;
  }

  .node.can-select-winner {
    cursor: pointer;
    transition: 0.5s;
  }
  .node.can-select-winner rect {
    /* stroke: #000;
    stroke-width: 0; */
    transition: 0.5s;
  }
  .node.can-select-winner:hover rect {
    /* stroke-width: 2px; */
    transform: scale(1.1);
  }
  .node.can-select-winner:active rect {
    /* stroke-width: 0; */
    transform: scale(1);
  }

  .node.loser-node {
    opacity: 0.2;
  }

  @keyframes flash {
    0% {fill: #eee;}
    50% {fill: #A3E4D7;}
    100% {fill: #eee;}
  }
  .node.has-entrant rect {
    animation-name: flash;
    animation-duration: 0.5s;
    animation-iteration-count: 1;
  }

  .node.no-entrant rect {
    fill: #bbb;
  }


  .tournament-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .tournament-icon {
    border: 2px solid #999;
    border-radius: 50%;
    background-color: white;
    width: 1.5em;
    height: 1.5em;
    font-size: 1em;
    margin: 0;
    padding: 0;
    text-align: center;
  }

</style>