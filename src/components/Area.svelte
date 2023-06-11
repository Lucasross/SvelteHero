<script lang="ts">
    import type AreaData from "../data/AreaData";
    import Progressbar from "./generic/Progressbar.svelte";
    import Title from "./generic/Title.svelte";
    import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
    
    
    export let area : AreaData;

    console.log(area);
    
    let seconds = 1;
    let health = 100;
	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});

    setInterval(() => {
        health -= 10;
        if(health < 0) {
            health = 100;
        }
        progress.set(health);
    }, seconds * 1000);

</script>

<div>
    <Title label={area.name} />
    <div class="container">
        <img src="{area.getPicture()}" alt="area" />
    </div>
    <div class="relative">
        <div class="absolute">
            <Progressbar progress={$progress} height={30} text="{health}/100" />
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
    .absolute {
        position: absolute;
        width: 90%;
        top: -50px;
        left: 5%
    }
</style>
