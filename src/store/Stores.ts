import { writable, type Writable } from "svelte/store";
import Hero from "../data/Hero";
import AreaData from "../data/AreaData";

const key_heroes: string = "key_heroes";
const key_area: string = "key_area";

// #region Hero
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
// #endregion

// #region Area
let raw_area_id : string = localStorage.getItem(key_area);
if(raw_area_id == null) {
    raw_area_id = "Plains of Koloh"
}

let stored_areaId = writable<string>(raw_area_id);

stored_areaId.subscribe(id => localStorage.setItem(key_area, id))
// #endregion

export const heroes = storedHeroes;
export const area_id = stored_areaId;