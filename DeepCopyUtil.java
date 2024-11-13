package Utilities;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class DeepCopyUtil {
    private static final Set<Class<?>> IMMUTABLE_TYPES = Set.of(
            String.class, Integer.class, Long.class, Boolean.class, Byte.class, Short.class, Float.class, Double.class, Character.class
    );

    public static <T> T deepCopy(T original) {
        return deepCopyHelper(original, new HashMap<>());
    }

    private static <T> T deepCopyHelper(T original, Map<Object, Object> copies) {
        if(original == null) return null;

        if(IMMUTABLE_TYPES.contains(original.getClass()) || original.getClass().isPrimitive()) {
            return original;
        }

        if(copies.containsKey(original)) {
            return (T) copies.get(original);
        }

        try {
            T copy = (T) original.getClass().getDeclaredConstructor().newInstance();
            copies.put(original, copy);

            for(Field field: original.getClass().getDeclaredFields()) {
                field.setAccessible(true);

                Object fieldValue = field.get(original);
                Object copiedValue = deepCopyHelper(fieldValue, copies);

                field.set(copy, copiedValue);
            }

            return copy;
        } catch (Exception e) {
            throw new RuntimeException("Deep copy failed!\n", e);
        }
    }
}
