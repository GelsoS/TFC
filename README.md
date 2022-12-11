# :construction: TFC Trybe Futebol Clube! :construction:
O TFC é um site informativo sobre partidas e classificações de futebol! soccer

Foi desenvolvido uma API (utilizando o método TDD) e também integrado - através do docker-compose - as aplicações para que elas funcionem consumindo um banco de dados.

Nesse projeto, foi construido um back-end dockerizado utilizando modelagem de dados através do Sequelize. O desenvolvimento respeita regras de negócio providas no projeto e sua API é capaz de ser consumida por um front-end.

Para adicionar uma partida é necessário ter um token, portanto a pessoa deverá estar logada para fazer as alterações. Teremos um relacionamento entre as tabelas teams e matches para fazer as atualizações das partidas.

O back-end implementa regras de negócio para popular adequadamente a tabela disponível no front-end que será exibida para a pessoa usuária do sistema.