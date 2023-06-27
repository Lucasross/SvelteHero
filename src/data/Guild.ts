import Hero from "./Hero";

export default class Guild {
    public gold: number;
    public inventory: Map<string, number>;
    public equipment: string[] = [];

    private savedInventory; // used in save

    constructor(gold: number) {
        this.gold = gold;
        this.inventory = new Map<string, number>();
        this.inventory.set('Iron', 3);
        this.inventory.set('Ardanium', 0);

        this.equipment.push("Templar Helmet");
        this.equipment.push("Templar Robe");
        this.equipment.push("Templar Necklace");
        this.equipment.push("Templar Tower Shield");
    }

    init(savedInventory, equipment) : Guild {
        this.inventory = new Map(JSON.parse(savedInventory));
        this.equipment = equipment == null ? [] : equipment;
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

