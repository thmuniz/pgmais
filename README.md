# PG Mais
Pg Mais NodeJS Test

* Remover o content type do header requisição para realizar os uploads.
* Ex:
![Example Image](https://i.imgur.com/JbNl6ks.png)
* Rodar os inserts do banco de dados (MySQL) contidos na pasta src/database/database.sql.
* Utilizar o Postman para realizar os testes. No body, form-data, escolha o arquivo .csv desejado.
* A configuração de acesso ao banco de dados encontra-se em src/database/mysqlConnector.js
* Clone do projeto 
```https://github.com/pgmais/test-nodejs.git```
* Ao clonar, executar o ```npm i``` para instalação das dependências e em seguida ```nodemon``` para rodar.
* O limite de upload foi definido no ```server.js``` para ```200mb```, alterar caso necessário.
* Para executar o testes, na pasta principal do projeto, no bash, executar ```cd src``` ou ```dir src``` e rodar o comando ```mocha```

# Desenvolvimento
* Sistema operacional utilizado: mac/windows
* Editor de texto: Visual Studio Code
* Postman para testes das rotas

# Libs: 
* Babel
* Nodemon (para desenvolvimento)
* Winston e Xhr2 (logs)
* Path, Multer, Fs, Fast-cvs (para leitura/gravação dos arquivos .csv)
* Express
* Body-parser (parse json)
* Compression (melhora de performance no compressão dos JSONs para gzip)
* Mocha, Chai, Chai-Http para testes

# Documentação
### ```POST``` /users
#### ```Description:``` Creates a new user, upload selected file and save the clients contained in .csv file

__Body__
```json
{
	"file": "fileName"
} 
```
__Response__
```json
{
    "_id": "xpto123",
    "name": "Donald Trump",
    "data_sent": "2019-05-02T16:39:31.162Z",
    "file_name": "DonaldTrump_xpto123.csv",
    "status": "upload_complete"
}
```
__Response Messages__
* ```201``` - __CREATED__
* ```500``` - __INTERNAL ERROR__
* ```400``` - __INVALID FILE EXTENSION__
##

### ```GET``` /users/{userId}/clients
#### ```Description:``` Returns a list of clients from User
__Response__
```json
[
    {
        "_id": 5,
        "name": "Client1",
        "CEP": 80020320,
        "CPF": 65464546,
        "data_sent": "2019-05-02T16:39:30.000Z",
        "address": {
            "district": "Centro",
            "street": "Rua Barão do Rio Branco",
            "state": "Curitiba"
        }
    },
    ...
]
```
__Response Messages__
* ```404``` - __THIS USER DOESN`T EXISTS__
* ```200``` - __OK__
* ```500``` - __INTERNAL ERROR__
##

### ```DELETE``` /users/{userId}
#### ```Description:``` Delete an user
__Response__
```json
{
    "_id": "xpto123",
    "name": "Donald Trump",
    "data_sent": "2019-05-02T16:39:31.000Z",
    "status": "deleted"
}
```
__Response Messages__
* ```404``` - __THIS USER DOESN`T EXISTS__
* ```200``` - __OK__
* ```500``` - __INTERNAL ERROR__
##

### ```PUT``` /users/{userId}
#### ```Description:``` Updates User's informations.
__Body__
```json
{
    "_id": "xpto123",
    "name": "Xpto"
}
```

__Response__
```json
{
    "_id": "xpto123",
    "name": "Xpto",
    "data_sent": "2019-05-02T16:55:07.000Z",
    "status": "updated_info"
}
```
__Response Messages__
* ```404``` - __THIS USER DOESN`T EXISTS__
* ```200``` - __OK__
* ```500``` - __INTERNAL ERROR__
##