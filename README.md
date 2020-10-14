# CVM-ENV (v1.0)

## 1. Installation:

    Complétez le fichier '...\private\src\Config\security.json' avec vos informations.
    ```
	{
		"server": {
			"host": "localhost",
			"db": {
				"name": "cvm-env",
				"default character": "utf8 COLLATE utf8_general_ci"
			}, 
			"charset": "utf8",
			"user": "",
			"pwd": ""
		},
		"mail": {
			"smtp": "",
			"sendmail_from": "",
			"smtp_port": ""
		},
		"oauth": {
			"google": {
				"client_id": "",
				"client_secret": "",
				"route": "google-connection"
			}
		}
	}
    ```
