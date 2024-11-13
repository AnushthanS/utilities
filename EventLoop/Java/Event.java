package Utilities;

public class Event {
    public final String key;
    public final String data;
    public final boolean async;

    public Event(String key, String data, boolean async) {
        this.key = key;
        this.data = data;
        this.async = async;
    }
}
