<script lang="ts">
    export let progress: number = 100;
    export let height: number = 60;
    export let textColor: string = "#fff";
    export let barColor: string = "#ff0000";
    export let text: string = "";
    export let borderPixel: number = 2;

    export let leftText: string = "";
    export let rightText: string = "";
</script>

<div
    class="progressbar-wrapper"
    style="height: {height}px; border: solid black {borderPixel}px"
>
    <div
        class="progressbar"
        style="background-color: {barColor}CC; width:{progress}%"
    />
    <span class="text" style="color: {textColor}; line-height: {height}px;">
        <span class="flex-left">{leftText}</span>
        <span class="flex-center">{text}</span>
        <span class="flex-right">{rightText}</span>
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
        display: flex;
        vertical-align: middle;
        text-align: center;
        top: 5%;
        font-weight: bold;
    }
    
    .flex-left {
        width: 100%;
        text-align: left;
        padding-left: 1%;
        white-space: nowrap;
    }
    
    .flex-center {
        width: 100%;
    }
    
    .flex-right {
        width: 100%;
        text-align: right;
        padding-right: 1%;
    }
</style>
