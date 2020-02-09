
<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src=".github/logo.png" width="300px" />
</h1>

<h3 align="center">
  ⚠️  Etapa 1/4 ⚠️
</h3>

## 🚀 Sobre o projeto

Esse projeto faz parte do desafio final da 10ª edição do Bootcamp GoStack da [Rocketseat](https://rocketseat.com.br/), utilizado para avaliação e emissão do certificado.

Ele se consiste na criação de uma aplicação para uma transportadora fictícia, nomeada FastFeet.

## 👨‍💻 Desenvolvimento

#### 👨‍🚀 **O que foi proposto?**

##### 📑 Etapa 1 ([GoStack - Desafio 02](https://github.com/Rocketseat/bootcamp-gostack-desafio-02))

A criação de um projeto com funcionalidades básicas aprendidas no segundo módulo do Bootcamp, dentre elas:

- Configuração do ambiente de desenvolvimento e padronização de código.
- Desenvolvimento de uma API utilizando [Express](https://expressjs.com/),
- Utilização da ORM [Sequelize](https://sequelize.org/) para manipulação do banco de dados, fazendo uma relação dos objetos com os dados que os mesmos representam.
- Autenticação de usuários utilizando [JWT](https://jwt.io/) (JSON Web Token)
- Validação de dados de entrada utilizando [Yup](https://github.com/jquense/yup)

<h2 align="center">
  ℹ️ Back-end
</h1>

## 💻 Tecnologias

Libs e tecnologias utilizadas no desenvolvimento da API:

- [x] [Node.js](https://nodejs.org/en/)
- [x] [Express](https://expressjs.com/)
- [x] [Postgres](https://www.postgresql.org/)
- [x] [Sequelize](https://sequelize.org/)
- [x] [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [x] [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [x] [Nodemon](https://nodemon.io/)
- [x] [Sucrase](https://github.com/alangpierce/sucrase)
- [x] [Yup](https://github.com/jquense/yup)
- [x] [ESLint](https://eslint.org/)
- [x] [Prettier](https://prettier.io/)

## 📚 Estrutura de pastas

```
src
│   app.js            
│   server.js         
  └───api
    └───controllers   
    └───jobs          
    └───middlewares   
    └───models        
    └───views      
      └───emails    
        └───layouts    
        └───partials    
  └───config          
  └───database        
  └───lib          
```

<h2 align="center">
  ℹ️ Instruções do projeto
</h1>

## 🏁 Instalação

#### 🟢 Back-end
```
# instala todas a dependências
yarn install

# executa as migrations e seeds
yarn sequelize db:create --if-not-exists
yarn sequelize db:migrate
yarn sequelize db:seed:all

# inicia a aplicação
yarn dev
````

## 📝 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

---

Feito com ♥️ by Brendenson -  [Github](https://github.com/trylix/) | [LinkedIn](https://www.linkedin.com/in/dobrendenson/)