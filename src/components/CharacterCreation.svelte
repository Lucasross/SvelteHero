<script lang="ts">
    import Modal from "./generic/Modal.svelte";
    import CharacterCreationModal from "./modal/CharacterCreationModal.svelte";
    
    let showModal = true;
</script>

<Modal bind:showModal>
    <CharacterCreationModal/>
</Modal>