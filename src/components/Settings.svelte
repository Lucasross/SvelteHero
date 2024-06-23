<script lang="ts">
    import Title from "./generic/Title.svelte";
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { onMount } from "svelte";
    import { logOut } from "./../services/firebase";

    // Firebase database
    import { signInWithGoogle } from "../services/firebase.js";
    import { saveGame } from "../services/firebase.js";

    let userID;

    const auth = getAuth();
    onMount(async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                userID = user.uid;
            } else {
                userID = null;
            }
        });
    });
</script>

<div>
    <Title label="Settings" />
    <div class="template sign-in">
        <div>
            {#if userID != null}
                <button on:click={saveGame}>Save</button>
            {/if}
        </div>

        <div>
            {#if userID == null}
                <button on:click={signInWithGoogle}>Log In</button>
            {:else}
                <button on:click={logOut}>Log Out</button>
            {/if}
        </div>
    </div>
</div>

<style>
    .sign-in {
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: solid black 1px;
        flex-direction: column;
    }
    .template {
        border: solid black 1px;
        border-top: 0px;
        background-color: #fdfdfd;
    }
</style>
