import { writable } from "svelte/store";
import Hero from "../data/Hero";

// Get stored object
const key_heroes: string = "key_heroes";
let storedHero: Array<Hero> = JSON.parse(localStorage.getItem(key_heroes));

if (storedHero == null) {
    storedHero = new Array<Hero>(
        new Hero("Loktar", 1),
    )
}

export const heroes = writable<Array<Hero>>(storedHero);

heroes.subscribe(value => {
    localStorage.setItem(key_heroes, JSON.stringify(value));
});