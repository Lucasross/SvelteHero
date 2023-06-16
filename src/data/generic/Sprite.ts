export default class Sprite {
    public readonly spritePath: string;
    public readonly sprite: Promise<any>;

    constructor(path: string) {
        this.sprite = fetch(path).then(r => r.blob().then(r => this.LoadSprite(r)));
    }

    LoadSprite(blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }
}