<script lang="ts">
    export let label : String;
</script>

<div>
    <p class="title">{label}</p>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
    }
    .title {
        padding: 5px 0 5px 0;
        background-color: #d8eaea;
        text-align: center;
        border-bottom: solid black 1px;
    }
</style>
