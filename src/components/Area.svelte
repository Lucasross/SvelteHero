<script lang="ts">
    import AreaData from "../data/AreaData";
    import type Monster from "../data/Monster";
        
    import Progressbar from "./generic/Progressbar.svelte";
    import Title from "./generic/Title.svelte";
    
    import { area_id } from "../store/Stores";
    import { tweened, type Tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
    import Sprite from "./generic/Sprite.svelte";

    let area : AreaData;
    let currentMonster: Monster;
    let progress : Tweened<number>;

    area_id.subscribe(id => {
        area = AreaData.getById(id);
        onChangeArea();
    })

    function onChangeArea() {
        progress = tweened(100, {
            duration: 0,
        });
        currentMonster = area.getMonster();
        update();
        progress = tweened((currentMonster.currentHealth/currentMonster.maxHealth) * 100, {
            duration: 400,
            easing: cubicOut,
        })
    }

    export function update() {
        currentMonster = area.getMonster();
        progress.set((currentMonster.currentHealth/currentMonster.maxHealth) * 100);
    }
</script>

<div>
    <Title enableGold={true} label={area.name} area={AreaData.getById($area_id)}/>
    <div class="template">
        <div class="relative">
            <div class="absolute-monstersprite">
                <Sprite sprite="{currentMonster.getSprite()}" alt="monster"/>
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
</div>

<style>
    .template {
        border: solid black 1px;
        border-top: 0px;
    }
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
    :global(.absolute-monstersprite > img) {
        height: 200px;
        display: block;
    }
</style>
