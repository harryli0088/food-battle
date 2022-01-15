<script lang="ts">
  import Fa from 'svelte-fa'
  import { faGithub } from '@fortawesome/free-brands-svg-icons'

  import Blanchor from '$lib/Blanchor.svelte';
  import type Tournament from '$lib/Tournament'
  import { powerRoundUp } from '$lib/Tournament';
  // import { faFilePdf } from '@fortawesome/free-solid-svg-icons'

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
      left,
      node,
      rect: {
        x: left,
        y: top,
        height: nodeDims.h,
        width: nodeDims.w,
      },
      text: {
        x: left + nodeDims.w / 2,
        y: top + nodeDims.h / 2,
      },
      top,
    }
  })
</script>

<div class="tournament" bind:clientHeight={height} bind:clientWidth={width}>
  <svg {height} {width}>
    <g>
      {#each renderNodeData as node}
        <g 
          class="node"
          on:click={() => {
            tournament.selectNodeWinner(node.node.id)
            tournament = tournament
          }}
        >
          <rect
            {...node.rect}
            fill="#eee"
          />
          <text {...node.text} text-anchor="middle" dy="0.35em">{tournament.entrants[node.node.entrantId]?.data || ""}</text>
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

  .node {
    cursor: pointer;
  }
</style>