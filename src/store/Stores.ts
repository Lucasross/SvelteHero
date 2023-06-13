import { writable, type Writable } from "svelte/store";
import Hero from "../data/Hero";

// Get stored object
const key_heroes: string = "key_heroes";
let rawHero = JSON.parse(localStorage.getItem(key_heroes));
let savedHeroes : Array<Hero> = [];
let storedHeroes : Array<Writable<Hero>> = [];

if (rawHero == null) {
    storedHeroes = new Array<Writable<Hero>>(
        writable<Hero>(new Hero(0, "Loktar", 1, 0)),
    )
} else {
    rawHero.forEach((h, i) => {
        let hero: Hero = new Hero(i, h.name, h.level, h.experience).Init(h.area_id);
        storedHeroes.push(writable<Hero>(hero));
    });
}

storedHeroes.forEach(h => {
    h.subscribe(h => {
        savedHeroes[h.saveIndex] = h;
        localStorage.setItem(key_heroes, JSON.stringify(savedHeroes));
    })
});


export const heroes = storedHeroes;