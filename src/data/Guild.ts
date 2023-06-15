import Hero from "./Hero";

export default class Guild {
    public gold: number;

    constructor(gold: number) {
        this.gold = gold;
    }

    recruit(nbHero: number) : Guild{
        this.gold -= Hero.goldForNextHero(nbHero);
        return this;
    }
}

