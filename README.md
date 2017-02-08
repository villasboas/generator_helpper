#HELPPER GENERATOR

Helpper generator é um gerador desenvolvido para trabalhar com a estrutura
de projetos usando TypeScript e express.

No momento, os geradores disponíveis são:

- Gerador de Aplicação
- Gerador de Controller
- Gerador de Model
- Gerador de Library

##Instalacao

Para instalar o Helpper generator, voce deve clonar esse repositório com o comando : 

```
git clone https://github.com/villasboas/generator_helpper
```

Depois, deve linkar o pacote para o seu o npm

```
npm link
```

Para o gerador o funcionar, o pacote yeoman generator deve estar instalado globalmente na
máquina.

##Gerador de Aplicacao

Na pasta onde sera gerada a aplicacao, deve ser executado o seguinte comando:

```
yo helpper <my_app_name>
```

Onde <my_app_name> deve ser o nome da sua Aplicação.

##Gerador de controller

Após gerar sua aplicação, é hora de criar alguns controllers para ela.
Por padrão, o Helpper generator cria um controller chamado WelcomeController.
Você pode edita-lo ou apaga-lo por completo.

O comando para gerar um novo controller é:

```
yo helpper:controller
```

Após isso, o gerador irá perguntar qual deverá ser o nome do controller.
Por padrão, o nome do controller é capitalizado e em camel case, seguidos pela
palavra Controller.

Ex.: UsuariosController, WelcomeController, ProdutosController

##Gerador de model

O comando para gerar uma model é parecido com o comando para gerar um controller.

```
yo helpper:model
```

O gerador ira pedir pela senha, nome do banco de dados e do usuário. Além disso,
você pode informar o nome da tabela pertencente ao model. Caso nenhuma tabela seja informada,
o gerador irá gerar uma model para cada tabela encontrada no banco.

##Gerador de Library

O comando para gerar uma library é:

```
yo helpper:library
```

Ele irá perguntar qual deve ser o nome da libray. As libraries geradas ficam em src/libraries/.

