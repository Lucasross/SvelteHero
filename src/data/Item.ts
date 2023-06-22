import type { ISprite } from "./generic/ISprite";
import Sprite from "./generic/Sprite";

export default class Item implements ISprite {

    public static items: Item[] = []; 
    
    public readonly id: string;
    public readonly name: string;
    public readonly spriteName: string;
    public readonly sprite: Sprite;

    constructor(name: string, spriteName: string) {
        this.id = name;
        this.name = name;
        this.spriteName = spriteName;
        this.sprite = new Sprite(this.getFullPath(spriteName));
    }

    getSprite(): Promise<any> {
        return this.sprite.sprite;
    }

    static getById(id: string): Item {
        let filtered = this.items.filter(m => m.id == id);

        if (filtered.length == 0)
            throw new Error("The following id '" + id + "' has no match in the items database.");

        return filtered[0];
    }

    private getFullPath(file: string): string {
        return "pictures/items/" + file + ".png";
    }
}

Item.items.push(new Item("Iron", "iron"));
Item.items.push(new Item("Ardanium", "ardanium"));