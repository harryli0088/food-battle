<script lang="ts">
  import Fa from 'svelte-fa'
  import { faGithub } from '@fortawesome/free-brands-svg-icons'

  import Blanchor from '$lib/Blanchor.svelte'
  import Tournament from '$lib/Tournament'
  import TournamentComponent from '$lib/Tournament.svelte'
  import shuffle from '$lib/shuffle'
  // import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
  
  const entrants = shuffle(["Pizza", "Pasta", "Sushi", "Viet", "Sando", "Mexican", "Burgers", "Chinese"])
  const tourn = new Tournament(entrants)
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

  <div id="tournament-container">
    <TournamentComponent tournament={tourn}/>
  </div>
</main>

<style>
	/* header {
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background-color: #17202A;
		color: white;
    text-align: center;
    height: 70vh;
	}
  @media only screen and (min-width: 600px) {
		header {
			height: 50vh;
		}
	} */

  #tournament-container {
    height: 100vh;
    background-color: #ddd;
    overflow: auto;
  }
</style>