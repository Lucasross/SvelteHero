import { writable, type Writable } from "svelte/store";
import Hero from "../data/Hero";
import Guild from "../data/Guild";
import AreaData from "../data/AreaData";
import { Jobs } from "../data/Job";

const key_heroes: string = "key_heroes";
const key_area: string = "key_area";
const key_guild: string = "key_guild";

// #region Hero
let rawHero = JSON.parse(localStorage.getItem(key_heroes));
let savedHeroes: Array<Hero> = [];
let storedHeroes: Array<Writable<Hero>> = [];

if (rawHero != null) {
    rawHero.forEach((h, i) => {
        let hero: Hero = new Hero(i, h.name, h.level, h.experience, Jobs[h.job as string]).Init(h.area_id, h.weaponSlot, h.jewelrySlot, h.headSlot, h.bodySlot, h.footSlot);
        let writableHero = writable<Hero>(hero);
        if (hero.isInLocation()) {
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

export let createHero = (name: string, job: Jobs, level: number = 1, experience: number = 0) => {
    let hero: Hero = new Hero(storedHeroes.length, name, level, experience, job);
    savedHeroes.push(hero);
    storedHeroes.push(writable<Hero>(hero));
    localStorage.setItem(key_heroes, JSON.stringify(savedHeroes));
    heroesUpdate.update(u => u = true);
}
// #endregion

// #region Area
let raw_area_id: string = localStorage.getItem(key_area);
if (raw_area_id == null) {
    raw_area_id = "Plains of Koloh"
}

let stored_areaId = writable<string>(raw_area_id);

stored_areaId.subscribe(id => localStorage.setItem(key_area, id))
// #endregion

// #region Guild
let rawGuild = JSON.parse(localStorage.getItem(key_guild));
let storedGuild: Writable<Guild>;

if (rawGuild == null)
    storedGuild = writable<Guild>(new Guild(0));
else 
    storedGuild = writable<Guild>(new Guild(rawGuild.gold).init(rawGuild.savedInventory, rawGuild.equipment));

storedGuild.subscribe(guild => {
    guild.prepareForSave();
    localStorage.setItem(key_guild, JSON.stringify(guild))
})
// #endregion 

export const area_id = stored_areaId;
export const heroes = storedHeroes;
export const guild = storedGuild;
export const heroesUpdate = writable<boolean>(false);

heroesUpdate.subscribe(u => {
    if(u) {
        setTimeout(() => u = false, 100);
    }
})
