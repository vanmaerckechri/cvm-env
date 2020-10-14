<?php

namespace src\Schema;

class UserSchema
{
    private $list = [
        'username' => [
            'required' => true,
            'customRules' => [
                'minMax' => [5, 36]
            ],
            'rules' => ['alphaNumericHyphens', 'underscoreBetween']
        ],
        'email' => [
            'required' => true,
            'customRules' => [
                'minMax' => [5, 254]
            ],
            'rules' => ['email']
        ],
        'password' => [
            'required' => true,
            'customRules' => [
                'minMax' => [8, 60]
            ],
            'rules' => ['atLeastOneNumber', 'atLeastOneLower', 'atLeastOneUpper', 'atLeastOneSpecialChar']
        ],
        'firstname' => [
            'required' => false,
            'customRules' => [
                'minMax' => [5, 36]
            ],
            'rules' => ['alphaAccentsSpace']
        ],
        'lastname' => [
            'required' => false,
            'customRules' => [
                'minMax' => [5, 36]
            ],
            'rules' => ['alphaAccentsSpace']
        ],
        'role' => [
            'required' => false,
            'rules' => ['number']
        ],
        'status' => [
            'required' => false,
        ],
        'token_activation' => [
            'required' => false,
        ],
        'token_password' => [
            'required' => false,
        ],
        'created_at' => [
            'required' => false,
        ]
    ];

    public function getSchema(string $field): ?array
    {
        if ($this->list[$field])
        {
            return $this->list[$field];
        }
        return null;
    }
}