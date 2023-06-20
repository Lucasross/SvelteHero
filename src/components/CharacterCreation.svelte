<script lang="ts">
    import Modal from "./generic/Modal.svelte";
    import CharacterCreationModal from "./modal/CharacterCreationModal.svelte";
    import { heroes } from "../store/Stores";

    let showModal = heroes.length == 0;
    let modal;

    function onHeroCreated() {
        modal.close();
    }
</script>

<Modal bind:this={modal} bind:showModal closable={false}>
    <CharacterCreationModal on:created={onHeroCreated} />
</Modal>
