import { writable, type Writable } from "svelte/store";
import Hero from "../data/Hero";
import AreaData from "../data/AreaData";

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
        let writableHero = writable<Hero>(hero);
        if(hero.isInLocation()) {
            AreaData.getById(hero.area_id).enter(writableHero);
        }
        storedHeroes.push(writableHero);
    });
}

storedHeroes.forEach(h => {
    h.subscribe(h => {
        savedHeroes[h.saveIndex] = h;
        localStorage.setItem(key_heroes, JSON.stringify(savedHeroes));
    })
});


export const heroes = storedHeroes;