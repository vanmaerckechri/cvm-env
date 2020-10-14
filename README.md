# CVM-ENV (v1.0)

## 1. Installation:

- Importez la base de donnée '...\private\src\Config\cvm-env.sql'.

- Complétez le fichier '...\private\src\Config\security.json' avec vos informations.

    ```
	{
		"server": {
			"host": "",
			"db": {
				"name": "",
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

## 2. Production:

- Rendez-vous sur '...\buildManager'. Laissez les options par défaut pour un test local ou adaptez le sous-dossier pour une version en ligne. La compilation se situera dans le dossier '...\buildManager\build'. Mettre en ligne et installez (voir chapitre 1).