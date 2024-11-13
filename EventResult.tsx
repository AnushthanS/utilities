export class EventResult{
    public readonly key: string;
    public readonly result: string;

    public constructor(key: string, result: string) {
        this.key = key;
        this.result = result;
    }
}