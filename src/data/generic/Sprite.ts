export default class Sprite {
    private readonly spritePath: string;
    private sprite: Promise<any>;

    constructor(path: string) {
        this.spritePath = path;
    }

    LoadSprite(blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    public get(): Promise<any> {
        if(this.sprite == null) {
            this.sprite = fetch(this.spritePath).then(r => r.blob().then(r => this.LoadSprite(r)));
        }
        
        return this.sprite;
    }
}