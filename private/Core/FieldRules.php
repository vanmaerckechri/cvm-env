<?php

namespace Core;

class FieldRules
{
    private static $list = [
        "alphaNumericHyphens" => "^\\w+$",
        "underscoreBetween" => "^(?!_)(?!.*__).*[^_]$",
        "email"  => "^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$",
        "alphaAccentsSpace" => "^[A-z À-ú]+$",
        "number" => "^[0-9]+$",
        "atLeastOneNumber" => "[0-9]+",
        "atLeastOneLower" => "[a-z]+",
        "atLeastOneUpper" => "[A-Z]+",
        "atLeastOneSpecialChar" => "[!@#\$%\^\&*\)\(+=._-]+",
        "minMax" => ".{[0],[1]}"
    ];

    public static function getList(): array
    {
        return self::$list;
    }

    public static function get(string $key): ?string
    {
        if (isset(self::$list[$key]))
        {
            return self::$list[$key];
        }
        return null;
    }
}