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
  export let nodeDims: NodeDimensionsType = {t: 20, b: 20, l: 40, r: 40, h: 75, w: 100}

  let height: number = 1000
  let width: number = 1000

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

    return {
      canDeselectNodeWinner: tournament.canDeselectNodeWinner(node)===true,
      canSelectNodeWinner: tournament.canSelectNodeWinner(node)===true,
      left,
      node,
      top,
    }
  })

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
</script>

<div class="tournament" bind:clientHeight={height} bind:clientWidth={width}>
  <svg {height} {width}>
    <g>
      {#each renderNodeData as n}
        <g 
          class={
            "node"
            + (n.canSelectNodeWinner?" can-select-winner":"")
            + (n.canDeselectNodeWinner?" can-deselect-winner":"")
          }

          transform={`translate(${n.left},${n.top})`}
        >
          <rect
            fill="#eee"
            height={nodeDims.h}
            width={nodeDims.w}
            x={0}
            y={0}
          />
          <text x={nodeDims.w/2} y={nodeDims.h/2} text-anchor="middle" dy="0.35em">
            {tournament.entrants[n.node.entrantId]?.data || ""}
          </text>

          {#if n.canDeselectNodeWinner}
            <foreignObject x={- 15} y={nodeDims.h/2 - 15} height="30" width="30">
              <div class="tournament-icon-container">
                <button class="tournament-icon" on:click={() => deselectNodeWinner(n.node)}>
                  <Fa icon={faTimes}/>
                </button>
              </div>
            </foreignObject>
          {/if}

          {#if n.canSelectNodeWinner}
            <foreignObject x={nodeDims.w - 15} y={nodeDims.h/2 - 15} height="30" width="30">
              <div class="tournament-icon-container">
                <button class="tournament-icon" on:click={() => selectNodeWinner(n.node)}>
                  <Fa icon={faArrowRight}/>
                </button>
              </div>
            </foreignObject>
          {/if}
        </g>
      {/each}
    </g>
  </svg>
</div>

<style>
  .tournament {
    height: 100%;
    width: 100%;
  }

  svg {
    background-color: pink;
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