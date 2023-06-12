<script lang="ts">
    import type AreaData from "../data/AreaData";
    import type Monster from "../data/Monster";
    import Progressbar from "./generic/Progressbar.svelte";
    import Title from "./generic/Title.svelte";
    import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
    
    export let area : AreaData;

    let currentMonster : Monster = area.encounters[Math.floor(Math.random() * area.encounters.length)];
    
    let seconds = 1;
    let health = currentMonster.health;
	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});

    setInterval(() => {
        health -= 10;
        if(health <= 0) {
            currentMonster = area.encounters[Math.floor(Math.random() * area.encounters.length)];
            health = currentMonster.health;
        }
        progress.set((health/currentMonster.health) * 100);
    }, seconds * 1000);

</script>

<div>
    <Title label={area.name} />
    <div class="relative">
        <div class="absolute-monstersprite">
            <img src="{currentMonster.getPicture()}" alt="monster"/>
        </div>
    </div>
    <div class="container">
        <img src="{area.getPicture()}" alt="area" />
    </div>
    <div class="relative">
        <div class="absolute-healthbar">
            <Progressbar progress={$progress} height={30} text="{health}/{currentMonster.health}" />
        </div>
    </div>
</div>

<style>
    .container > img {
        display: block;
        height: 250px;
        width: 100%;
        object-fit: cover;
    }
    .relative {
        position: relative;
    }
    .absolute-healthbar {
        position: absolute;
        width: 90%;
        top: -50px;
        left: 5%
    }
    .absolute-monstersprite {
        position: absolute;
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .absolute-monstersprite > img {
        height: 200px;
        display: block;
    }
</style>
