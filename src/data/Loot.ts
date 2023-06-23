import type { ISprite } from "./generic/ISprite";
import Sprite from "./generic/Sprite";

export default abstract class Loot implements ISprite {    
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

    protected abstract picturesPath(): string; 

    getSprite(): Promise<any> {
        return this.sprite.sprite;
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