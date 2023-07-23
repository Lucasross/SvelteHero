import { Utility } from "../utility/Utility";
import type { ISprite } from "./generic/ISprite";
import Sprite from "./generic/Sprite";

export default abstract class Loot implements ISprite {    
    public readonly id: string;
    public readonly name: string;
    public readonly spriteName: string;
    public readonly sprite: Sprite;
    public readonly gold: number;
    public readonly lootWeight: number;

    constructor(name: string, spriteName: string, gold: number, lootWeight: number) {
        this.id = name;
        this.name = name;
        this.spriteName = spriteName;
        this.gold = Math.floor(gold);
        this.lootWeight = lootWeight;
        this.sprite = new Sprite(this.getFullPath(spriteName));
    }

    protected abstract picturesPath(): string; 
    public abstract getType(): LootType;

    getSprite(): Promise<any> {
        return this.sprite.get();
    }

    public static golfForLevel(level: number) {
        let a: number = 0.01;
        let b: number = 0.04;
        let c: number = 6;
        let d: number = 190;
        return Utility.Polynome3(a, b, c, d, level);
    }

    protected static getLootById<T extends Loot>(database: T[], id: string, debugName: string = "loots"): T {
        let filtered = database.filter(m => m.id == id);

        if (filtered.length == 0)
            throw new Error(`The following id ${id} has no match in the ${debugName} database.`);

        return filtered[0] as T;
    }

    private getFullPath(file: string): string {
        return `pictures/${this.picturesPath()}/${file}.png`;
    }
}

export enum LootType {
    Equipment,
    Item,
}