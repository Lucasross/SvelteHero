<script lang="ts">
    export let label : String;
    export let enableGold : boolean = false;
</script>

<div class="container">
    <div class="title">
        {#if enableGold}
        <img style="display: inline-block" height="16px" src="pictures/cash.png" alt="cash"/> 
        <p style="display:inline;">Golds</p>
        {/if}
    </div>
    <p class="title">{label}</p>
    <p class="title"></p>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
    }
    .container {
        display: flex;
        border: solid black 1px;
        padding: 5px 0 5px 0;
        background-color: #d8eaea;
    }
    .title {
        flex:1;
        text-align: center;
    }
</style>
