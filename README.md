# Spotkate
Projeto criado por https://github.com/candidomorantepelaez 

## Features
Node express app based on sqlite (dev) and postgresql (prod). Uses sequelize package to access database

## Running
Para executa a aplicação no navegador execute os seguintes passos:

    git clone https://github.com/RELATO/spotkate.git
    cd spotkate
    npm install
    
    export DATABASE_URL=sqlite://:@:/
    node ./bin/www

Abrir o navegador no endereço: http://localhost:3000 

## Warning
Foram encontrados alguns erros ao rodar a aplicação com node v5.5.0
