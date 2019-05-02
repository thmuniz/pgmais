# pgmais
Pg Mais NodeJS Test

* Remover o content type do header requisição para realizar os uploads.<br/>
* Rodar os inserts do banco de dados (MySQL) contidos na pasta src/database/database.sql.
* Utilizar o Postman para realizar os testes. No body, form-data, escolha o arquivo .csv desejado.
* A configuração de acesso ao banco de dados encontra-se em src/database/mysqlConnector.js
* Clone do projeto https://github.com/pgmais/test-nodejs.git
* Ao clonar, executar o npm i para instalação das dependências e em seguida nodemon para rodar.
* O limite de upload foi definido no server.js para 200mb, alterar caso necessário.

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
