<script lang="ts">
  import Fa from 'svelte-fa'
  import { faGithub } from '@fortawesome/free-brands-svg-icons'

  import Blanchor from '$lib/Blanchor.svelte'
  import Tournament from '$lib/Tournament'
  import TournamentComponent from '$lib/Tournament.svelte'
  import shuffle from '$lib/shuffle'
  import { onMount } from 'svelte';
  import { loadEntrants } from '$lib/localStorage';
  // import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
  
  let entrants:string[] = loadEntrants() || ["🍕 Pizza", "🍝 Pasta", "🍣 Sushi", "🍜 Viet", "🥪 Sando", "🌯 Mexican", "🍔 Burgers", "🥡 Chinese"]
  $: tourn = new Tournament<string>(entrants)

  onMount(() => {
    entrants = shuffle(entrants)
  })
</script>

<main>
	<!-- <header>
    <div>
      <h1>Svelte Kit Template</h1>
      <br/>
      <div style="font-size:2em">
        <Blanchor href="https://github.com/harryli0088/svelte-kit-template">
          <Fa class="icon-button" icon={faGithub} style="color:white;"/>
        </Blanchor>
      </div>
    </div>
  </header> -->

  <TournamentComponent tournament={tourn}/>
</main>

<style>
</style>