<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Job, { Jobs } from "../../data/Job";
    import { createHero } from "../../store/Stores";

    let heroName = "Unknow";
    let selectedJob = Job.jobs[Math.floor(Math.random() * Job.jobs.length)].name;

    const dispatch = createEventDispatcher();

    function select(e, job: Job) {
        selectedJob = job.name;
    }

    function create() {
        createHero(heroName, Jobs[selectedJob]);
        dispatch('created');
    }
</script>

<div class="container">
    <h1>Create your character</h1>
    <span>Name :</span>
    <!-- svelte-ignore a11y-autofocus -->
    <input autofocus maxlength="16" placeholder="(Ex. Derfi)" type="text" bind:value={heroName}/>
    <div class="grid">
        {#each Job.jobs as job}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="item {job.name == selectedJob ? "selected" : ""}" on:click={(e) => select(e, job)} >
                <h4>{job.name}</h4>
                <img src="{job.getPicture()}" alt="class"/>
            </div>
        {/each}
    </div>
    <button style="margin-top: 20px;" on:click={create}>
        Create <b>{heroName}</b> as a <b>{selectedJob}</b> ?
    </button>
</div>

<style>
    .container {
        min-width: 32vw;
    }
    .grid {
		display:grid;
		grid-template-columns:auto auto auto auto;
        grid-gap: 10px;
	}
    .item {
        text-align: center;
        border: 1px black solid;
        border-radius: 5%;
        transition: transform .2s;
    }
    .selected {
        background-color: orange;
    }
    .item:hover {
        transform: scale(1.1); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
    }
</style>
