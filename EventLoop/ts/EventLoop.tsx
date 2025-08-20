import { Event } from "./Event";
import { EventResult } from "./EventResult";

export class EventLoop {
    private readonly events: Event[];
    private readonly handlers: Map<string, (data: string) => string>;
    private readonly processedEvents: EventResult[]

    constructor() {
        this.events = [];
        this.handlers = new Map();
        this.processedEvents = [];
    }

    public on(key: string, handler: (data: string) => string): this {
        this.handlers.set(key, handler);
        return this;
    }

    public dispatch(event: Event): void {
        this.events.push(event);
    }

    public run() : void {
        const event = this.events.shift();

        if(event) {
            console.log(`\nReceived Event: ${event.key}`);

            if(this.handlers.has(event.key)) {
                const startTime = Date.now();

                if(event.async) this.processAsynchronously(event);
                else this.processSynchronously(event);

                const endTime = Date.now();
                const duration = endTime - startTime;

                console.log(`\nEvent loop was blocked for ${duration} ms due to this operation`);

            } else console.log(`\nNo handler found for this ${event.key}`);
        }

        const processedEvent = this.processedEvents.shift();
        if(processedEvent) this.produceOutputFor(processedEvent);
    }

    private processAsynchronously(event: Event): void {
        setTimeout(() => {
            const result = this.handlers.get(event.key)?.(event.data);
            
            if(result !== undefined) this.processedEvents.push(new EventResult(event.key, result));
        }, 0);
    }

    private processSynchronously(event: Event): void {
        const result = this.handlers.get(event.key)?.(event.data);
        if(result !== undefined) this.produceOutputFor(new EventResult(event.key, result));
    }

    private produceOutputFor(eventResult: EventResult): void {
        console.log(`\nOutput for Event ${eventResult.key} : ${eventResult.result}\n`);
    }
}