<?php

namespace Core;

class Messages
{
    private static $list = [
        // FIELD RULES
        "alphaAccentsSpace"  => 
        [
            "en" => "Only alphabetic characters (accents allowed) and spaces are accepted.",
            "fr" => "Seuls les caractères alphabétiques (accents autorisés) et les espaces sont acceptés."
        ],
        "alphaNumericHyphens" =>
        [
            "en" => "Only alphanumeric characters and hyphens are accepted.",
            "fr" => "Seuls les caractères alphanumériques ainsi que les \"tirets bas\" sont acceptés."
        ],
        "email"  => 
        [
            "en" => "Invalid email.",
            "fr" => "Email non valide."
        ],
        "number"  => 
        [
            "en" => "Only numbers are accepted.",
            "fr" => "Seuls les chiffres sont acceptés."
        ],
        "underscoreBetween"  =>
        [
            "en" => "Hyphens can only be located between two other types of characters.",
            "fr" => "Les \"tirets bas\" ne peuvent être situés qu'entre deux autres types de caractères."
        ],
        // at least one...
        "atLeastOneNumber" =>
        [
            "en" => "Requires at least one number.",
            "fr" => "Nécessite au moins un chiffre."
        ],
        "atLeastOneLower" =>
        [
            "en" => "Requires at least a lowercase letter.",
            "fr" => "Nécessite au moins une lettre minuscule."
        ],
        "atLeastOneUpper" =>
        [
            "en" => "Requires at least a uppercase letter.",
            "fr" => "Nécessite au moins une lettre majuscule."
        ],
        "atLeastOneSpecialChar" =>
        [
            "en" => "Requires at least one special character.",
            "fr" => "Nécessite au moins un caractere special."
        ],
        "registerFormSuccess" =>
        [
            "en" => "A confirmation email has just been sent to you.",
            "fr" => "Un email de confirmation vient de vous être envoyé."
        ],
        // with custom values
        "alreadyUse" => 
        [
            'en' => "[0] is already use!",
            'fr' => "[0] est déjà utilisé!"
        ],
        "minMax" => 
        [
            'en' => "The number of characters must be between [0] and [1].",
            'fr' => "Le nombre de caractères doit être compris entre [0] et [1]."
        ],
        "passwordTooManyFailedAttempts" =>
        [
            "en" => "You have made [0] consecutive connection attempts which have failed. Please wait [1] minutes then try again.",
            "fr" => "Vous avez fait [0] tentatives de connexion consécutives qui ont échouées. Veuillez patienter [1] minutes puis faites un nouvel essai."
        ],
        // special case
        "passwordConfirm" =>
        [
            "en" => "Passwords must match.",
            "fr" => "Les mots de passe doivent correspondre."
        ],
        // form submit success
        "accountActivationSuccess" => 
        [
            "en" => "Your account has just been activated. Welcome!",
            "fr" => "Votre compte vient d'être activé. Bienvenue!"
        ],
        "deleteAccountFormSuccess" => 
        [
            "en" => "Your account has just been deleted.",
            "fr" => "Votre compte vient d'être supprimé."
        ],
        "changeEmailFormSuccess" => 
        [
            "en" => "Email address successfully changed.",
            "fr" => "Adresse Email modifiée avec succes."
        ],
        "loginFormSuccess" =>
        [
            "en" => "Welcome [0].",
            "fr" => "Bienvenue [0]."
        ],
        "passwordResetMailFormSuccess" => 
        [
            "en" => "A password reset link has just been emailed to you.",
            "fr" => "Un lien de réinitialisation de mot de passe vient de vous être envoyé par mail."
        ],
        "passwordResetPasswordFormSuccess" => 
        [
            "en" => "Password successfully changed.",
            "fr" => "Mot de passe modifié avec succes."
        ],
        "profilFormSuccess" =>
        [
            "en" => "Your profile is updated.",
            "fr" => "Votre profil est mis à jour."
        ],
        "registerGoogleFormSuccess" =>
        [
            "en" => "Welcome [0].",
            "fr" => "Bienvenue [0]."
        ],
        // form submit error
        "accountBan" => 
        [
            "en" => "This account is deactivated, please contact the site manager.",
            "fr" => "Ce compte est désactivé, veuillez contacter le gestionnaire du site."
        ],
        "accountNeedValidation" => 
        [
            "en" => "Your account requires activation. A new validation email has just been sent to you.",
            "fr" => "Votre compte nécessite une activation. Un nouvel email de validation vient de vous être envoyé."
        ],
        "passwordResetMailFormError" => 
        [
            "en" => "No account is linked to this email address.",
            "fr" => "Aucun compte n'est lié à cette adresse email."
        ],
        "loginFormError" =>
        [
            "en" => "Incorrect username or password.",
            "fr" => "Nom d'utilisateur ou mot de passe incorrect."
        ],
        "passwordFormError" =>
        [
            "en" => "Incorrect password.",
            "fr" => "Mot de passe incorrect."
        ],
        "tokenError" => 
        [
            "en" => "Invalid link!",
            "fr" => "Lien non valide!"
        ]
    ];

    public static function getList(): array
    {
        return self::$list;
    }
}