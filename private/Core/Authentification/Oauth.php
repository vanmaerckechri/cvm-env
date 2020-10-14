<?php

namespace Core\Authentification;

class Oauth
{
	private static $config;
	private static $network;
	private static $code;

	public static function login(string $network, string $code): ?object
	{
		// network = google, facebook, etc.
		self::$network = $network;
		self::$code = $code;
		$userInfos = self::getUserInfos();
		if (!$userInfos)
		{
			return null;
		}
		return $userInfos;
	}

    public static function getListForClient(string $network, array $keys): array
	{
		$output = [];
        $networkInfos = self::getList()[$network];
        foreach ($networkInfos as $key => $value)
        {
        	if (in_array($key, $keys))
        	{
        		$output[$key] = $value;
        	}
        }

        return $output;
    }

    private static function getList(): array
	{
	    $file = __DIR__ . '/../../src/Config/security.json';
        $output = json_decode(file_get_contents($file), true)['oauth'];

        return $output;
    }

	private static function getConfig(): array
	{
		if (is_null(self::$config))
		{
			self::$config = self::getList();
		}
		return self::$config[self::$network];
	}

	private static function getEndPoint(): ?object
	{
		return json_decode(@file_get_contents('https://accounts.google.com/.well-known/openid-configuration', false));
	}

	private static function getToken(string $tokenEndPoint): ?object
	{
		$config = self::getConfig();

		$host = (substr($_SERVER['HTTP_REFERER'], 0, 5) == "http:" ? "http://" : "https://") . $_SERVER['HTTP_HOST'];
		$lang = substr($_SERVER['HTTP_REFERER'], strlen($host), strpos($_SERVER['HTTP_REFERER'], $config['route']) - strlen($host));

		$content = array(
			'grant_type' => 'authorization_code',
	        'code' => self::$code,
			'client_id' => $config['client_id'],
			'client_secret' => $config['client_secret'],
			'redirect_uri' => $host . $lang . $config['route']
		);

		$content = http_build_query($content);

		$options = array(
			'http'=>array(
				'method' => 'POST',
            	'header' => 'Content-type: application/x-www-form-urlencoded',
            	'content' => $content
			)
		);

		$context = stream_context_create($options);

		return json_decode(@file_get_contents($tokenEndPoint, false, $context));
	}

	private static function getUserInfos(): ?object
	{
		$endPoint = self::getEndPoint();
		if (!$endPoint)
		{
			return null;
		}
		$tokenEndPoint = $endPoint->token_endpoint;
		$userInfoEndPoint = $endPoint->userinfo_endpoint;

		$token = self::getToken($tokenEndPoint);
		if (!$token)
		{
			return null;
		}
		$accessToken = $token->access_token;

		$options = array(
			'http'=>array(
				'method'=>'GET',
            	'header'=> 'Authorization: Bearer' . $accessToken
            )
		);

		$context = stream_context_create($options);

		return json_decode(@file_get_contents($userInfoEndPoint, false, $context));
	}
}