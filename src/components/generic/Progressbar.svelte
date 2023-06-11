<script lang="ts">
    export let progress: number = 100;
    export let height: number = 60;
    export let textColor: string = "#fff";
    export let barColor: string = "#ff0000";
    export let text: string = "";
</script>

<div class="progressbar-wrapper" style="height: {height}px;">
    <div
        class="progressbar"
        style="background-color: {barColor}CC; width:{progress}%"
    />
    <span class="text" style="color: {textColor}; line-height: {height}px;">
        <b>{text}</b>
    </span>
</div>

<style>
    .progressbar-wrapper {
        background-color: #dfe6e988;
        width: 100%;
        border: solid black 2px;
    }

    .progressbar {
        position: relative;
        font-size: 20px;
        height: 100%;
    }

    .text {
        position: absolute;
        width: 100%;
        text-align: center;
        vertical-align: middle;
        top: 5%;
    }
</style>
