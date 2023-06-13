<script lang="ts">
    import type AreaData from "../data/AreaData";
    import type Monster from "../data/Monster";

    import Progressbar from "./generic/Progressbar.svelte";
    import Title from "./generic/Title.svelte";

    import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
    
    export let area : AreaData;
    
    let frameSpeed = 1; //in seconds
	const progress = tweened(100, {
		duration: 400,
		easing: cubicOut
	});
    
    let currentMonster: Monster = area.getMonster();

    setInterval(() => {
        area.update();
        currentMonster = area.getMonster();
        progress.set((currentMonster.currentHealth/currentMonster.maxHealth) * 100);
    }, frameSpeed * 1000);

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
            <Progressbar progress={$progress} height={30} text="{currentMonster.currentHealth}/{currentMonster.maxHealth}" />
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
