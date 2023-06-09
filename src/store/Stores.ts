import { readable, writable, type Readable } from "svelte/store";
import Hero from "../data/Hero";

// Get stored object
const key_hero : string = "key_hero";
let storedHero : Hero = JSON.parse(localStorage.getItem(key_hero));

if(storedHero == null)
    storedHero = new Hero("Default", 1)

// Export them as writable and readable
export const writableHero = writable<Hero>(storedHero);
export const readableHero : Readable<Hero> = readable<Hero>(storedHero);

writableHero.subscribe(value => {
    localStorage.setItem(key_hero, JSON.stringify(value));
});