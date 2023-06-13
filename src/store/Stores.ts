import { writable } from "svelte/store";
import Hero from "../data/Hero";

// Get stored object
const key_heroes: string = "key_heroes";
let rawHero = JSON.parse(localStorage.getItem(key_heroes));
let storedHeroes : Array<Hero> = [];

if (rawHero == null) {
    storedHeroes = new Array<Hero>(
        new Hero("Loktar", 1, 0),
    )
} else {
    rawHero.forEach(h => {
        let hero: Hero = new Hero(h.name, h.level, h.experience).Init(h.area_id);
        storedHeroes.push(hero);
    });
}

export const heroes = writable<Array<Hero>>(storedHeroes);

heroes.subscribe(value => {
    localStorage.setItem(key_heroes, JSON.stringify(value));
});