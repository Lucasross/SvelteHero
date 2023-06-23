import Hero from "./Hero";

export default class Guild {
    public gold: number;
    public inventory: Map<string, number>;
    public equipement: string[] = [];

    private savedInventory; // used in save

    constructor(gold: number) {
        this.gold = gold;
        this.inventory = new Map<string, number>();
        this.inventory.set('Iron', 3);
        this.inventory.set('Ardanium', 0);

        this.equipement.push("Iron");
        this.equipement.push("Iron");
        this.equipement.push("Iron");
        this.equipement.push("Iron");
    }

    init(savedInventory) : Guild {
        this.inventory = new Map(JSON.parse(savedInventory));
        return this;
    }

    prepareForSave() {
        this.savedInventory = JSON.stringify([...this.inventory]);
    }

    recruit(nbHero: number) : Guild{
        this.gold -= Hero.goldForNextHero(nbHero);
        return this;
    }
}

