<script lang="ts">
    import Title from "./generic/Title.svelte";
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { onMount } from "svelte";
    import { logOut } from "./../services/firebase";

    // Firebase database
    import {
        signInWithGoogle,
        saveGame,
        loadGame,
    } from "../services/firebase.js";

    let userID;

    console.log("App call firestore")
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
        {#if userID != null}
            <div>
                <button on:click={loadGame}>
                    <i class="fa-solid fa-download"></i>
                    Load
                </button>
            </div>
            <div>
                <button on:click={saveGame}>
                    <i class="fa-solid fa-floppy-disk"></i>
                    Save
                </button>
            </div>
        {/if}

        <div>
            {#if userID == null}
                <button on:click={signInWithGoogle}>
                    <i class="fa-solid fa-right-to-bracket"></i>
                    Log In
                </button>
            {:else}
                <button on:click={logOut}>
                    <i class="fa-solid fa-right-to-bracket reverse"></i>
                    Log Out
                </button>
            {/if}
        </div>
    </div>
</div>

<style>
    .sign-in {
        padding-top: 8px;
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
    .reverse {
        transform: scaleX(-1)
    }
</style>
