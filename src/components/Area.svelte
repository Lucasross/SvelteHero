<script lang="ts">
    import AreaData from "../data/AreaData";
    import type Monster from "../data/Monster";

    import Sprite from "./generic/Sprite.svelte";
    import Progressbar from "./generic/Progressbar.svelte";
    import Title from "./generic/Title.svelte";

    import { area_id, guild } from "../store/Stores";
    import { tweened, type Tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";

    let area: AreaData = AreaData.getById($area_id);
    let currentMonster: Monster;
    let progress: Tweened<number>;
    let progressTimerText: string;
    let progressTimer: Tweened<number> = tweened(area.getNormalizedTimer() * 100, {
        duration: 400,
        easing: cubicOut,
    });

    area_id.subscribe((id) => {
        area = AreaData.getById(id);
        onChangeArea();
    });

    function onChangeArea() {
        progress = tweened(100, { duration: 0 });
        currentMonster = area.getMonster();
        update();
        progress = tweened((currentMonster.getHealth()  / currentMonster.maxHealth) * 100, {
            duration: 400,
            easing: cubicOut,
        });
        progressTimer = tweened(area.getNormalizedTimer() * 100, {
            duration: 400,
            easing: cubicOut,
        });
    }

    export function update() {
        currentMonster = area.getMonster();
        progress.set((currentMonster.getHealth()  / currentMonster.maxHealth) * 100);
        
        progressTimer.set(area.getNormalizedTimer() * 100);
        progressTimerText = (area.getNormalizedTimer() * area.timePerMonster).toFixed(1);
    }

    function DamageCurrentMonster() {
        currentMonster.damage(Math.round(5 + area.getAreaDps() * 0.1));
        if(currentMonster.isDead()) {
            currentMonster.die(guild, area.getHeroes())
        }
        update();
    }
</script>

<div>
    <Title
        enableGold={true}
        label={area.name}
        area={AreaData.getById($area_id)}
    />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="template" on:click={DamageCurrentMonster}>
        <div class="relative">
            <div class="absolute-monstersprite">
                <Sprite sprite={currentMonster.getSprite()} alt="monster" />
            </div>
        </div>
        {#if area.isTimedArea()}
            <div class="relative">
                <div class="absolute-timer">
                    <Progressbar
                        progress={$progressTimer}
                        height={25}
                        text={progressTimerText}
                        borderPixel={0}
                        barColor="#5DADE2"
                    />
                </div>
            </div>
        {/if}
        <div class="container-area">
            <Sprite sprite={area.getSprite()} alt="{area.name}" />
        </div>
        <div class="relative">
            <div class="absolute-healthbar">
                <Progressbar
                    progress={$progress}
                    height={30}
                    leftText="{currentMonster.name}"
                    text="{currentMonster.getHealth().toLocaleString()}/{currentMonster.maxHealth.toLocaleString()}"
                    rightText="{currentMonster.level.toString()}"
                />
            </div>
        </div>
    </div>
</div>

<style>
    .template {
        border: solid black 1px;
        border-top: 0px;
    }
    :global(.container-area > img) {
        display: block;
        height: 300px;
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
        left: 5%;
    }
    .absolute-monstersprite {
        position: absolute;
        width: 100%;
        display: flex;
        top: 50px;
        justify-content: center;
    }
    .absolute-timer {
        position: absolute;
        width: 100%;
    }
    :global(.absolute-monstersprite > img) {
        height: 200px;
        display: block;
    }
</style>
