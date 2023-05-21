<?php

if (! function_exists('get_array_value_safely')) {
    function get_array_value_safely(array $source, string $keys, $default = null) {
        $keys = explode('.', $keys);
        $value = $source;

        foreach ($keys as $key) {
            $value = $value[$key] ?? $default;
        }

        return $value;
    }
}
