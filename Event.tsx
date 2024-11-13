export class Event{
    public readonly key: string;
    public readonly data: string;
    public readonly async: boolean;

    constructor(key: string, data: string, async: boolean) {
        this.key = key;
        this.data = data;
        this.async = async;
    }
}