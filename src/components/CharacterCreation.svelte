<script lang="ts">
    import Modal from "./generic/Modal.svelte";
    import CharacterCreationModal from "./modal/CharacterCreationModal.svelte";
    import { heroes } from "../store/Stores";
    import { createEventDispatcher } from "svelte";

    export let showModal = heroes.length == 0;
    export let closable = false;
    let modal;

    const dispatch = createEventDispatcher();

    function onHeroCreated() {
        modal.close();
        dispatch('heroCreated');
    }
</script>

<Modal bind:this={modal} bind:showModal closable={closable}>
    <CharacterCreationModal on:created={onHeroCreated} />
</Modal>
