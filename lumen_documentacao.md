#  Documentação – Requisitos de Engenharia de Software

Este documento apresenta 3 (três) features do sistema **Lumen**, descritas com base em técnicas da Engenharia de Software.  
Cada feature contém sua *user story*, critérios de aceitação no formato **BDD (Behavior-Driven Development)** e um caso de uso.  
Além disso, a documentação inclui:

-  Diagrama de Classes  
-  Dois Diagramas de Sequência (realizar doação e visualizar histórico)  
-  Um Diagrama de Atividades (realizar doação para ONG)  

---

##  FEATURE 1: Realizar Doação para uma ONG

###  User Story

> COMO usuário logado,  
> QUERO realizar uma doação para uma ONG,  
> PARA contribuir com causas sociais que apoio.

###  Critérios de Aceitação (BDD)

**Cenário: Doação realizada com sucesso**  
- DADO QUE estou autenticado como usuário,  
- QUANDO preencho corretamente os dados da doação e confirmo o envio,  
- ENTÃO a doação é registrada no sistema,  
- E recebo uma confirmação de sucesso na interface.

**Cenário: Valor inválido**  
- DADO QUE estou autenticado como usuário,  
- E estou na tela de doação para uma ONG,  
- QUANDO insiro um valor igual ou menor que zero e tento confirmar a doação,  
- ENTÃO vejo a mensagem:  
  > "O valor da doação, se fornecido, deve ser maior que zero."  
- E a doação não é registrada.

###  Use Case

- **Ator principal:** doador  
- **Pré-condição:** estar autenticado na plataforma  

**Fluxo principal:**
1. Usuário acessa o formulário de doação  
2. Preenche valor e escolhe ONG  
3. Frontend envia dados para o backend  
4. Backend cria e armazena a doação  
5. Confirmação é exibida ao usuário  

**Fluxo de exceção – Valor inválido:**  
→ Sistema exibe a mensagem:  
> "O valor da doação, se fornecido, deve ser maior que zero."

---

##  FEATURE 2: Visualizar Histórico das Doações Realizadas

###  User Story

> COMO usuário logado,  
> QUERO ver uma lista das doações que já realizei,  
> PARA acompanhar minhas doações ao longo do tempo.

###  Critérios de Aceitação (BDD)

**Cenário: Nenhuma doação registrada**  
- DADO QUE estou autenticado como doador,  
- E ainda não realizei nenhuma doação,  
- QUANDO acesso o painel de minhas doações,  
- ENTÃO vejo a mensagem:  
  > "Você ainda não realizou doações."

**Cenário: Doações existentes**  
- DADO QUE estou autenticado como usuário,  
- E já realizei pelo menos uma doação,  
- QUANDO acesso o painel de minhas doações,  
- ENTÃO vejo, para cada doação:  
  - a data em que foi feita,  
  - o valor doado,  
  - e a ONG beneficiada.

###  Use Case

- **Ator principal:** doador  
- **Pré-condição:** estar autenticado  

**Fluxo principal:**
1. Usuário acessa o painel de doações  
2. Frontend requisita histórico de doações do backend  
3. Backend retorna lista de doações do usuário  
4. Interface exibe os dados  

**Fluxo alternativo – Lista vazia:**  
→ Exibe a mensagem:  
> "Você ainda não realizou doações."

**Fluxo de exceção – Sessão expirada:**  
→ Redireciona para a tela de login

---

##  FEATURE 3: Visualizar Histórico de Doações Recebidas

###  User Story

> COMO administrador de uma ONG,  
> QUERO visualizar todas as doações feitas para minha organização,  
> PARA acompanhar o desempenho das arrecadações.

###  Critérios de Aceitação (BDD)

**Cenário: Sem dados disponíveis**  
- DADO QUE estou autenticado como administrador de uma ONG,  
- E ainda não há registros de doações para minha organização,  
- QUANDO acesso o painel de doações,  
- ENTÃO vejo a mensagem:  
  > "Sem dados disponíveis"  
- E nenhum gráfico ou tabela é exibido.

**Cenário: Visualizar o painel de doações**  
- DADO QUE estou autenticado como administrador de uma ONG,  
- QUANDO acesso o painel de doações,  
- ENTÃO vejo cards contendo gráficos de:
  - Tendência de Doações  
  - Crescimento de Doadores  
  - Perfil Demográfico dos Doadores  
  - Impacto Financeiro  

###  Use Case

- **Ator principal:** ONG  
- **Pré-condição:** estar logado na plataforma como ONG  

**Fluxo principal:**
1. ONG acessa painel de doações  
2. Frontend envia requisição para o backend  
3. Backend retorna os dados das doações  
4. Interface exibe os dados em gráficos  

**Fluxo alternativo – Sem dados:**  
→ Mensagem:  
> "Sem dados disponíveis"

**Fluxo de exceção – Falha de API:**  
→ Mensagem de erro

---

##  Diagramas UML

- **Diagrama de Classes**  
- **Diagrama de Atividades**  
- **2 Diagramas de Sequência**

Acessíveis em:  
 [Notion – Diagramas Exp Criativa](https://standing-wolverine-ea8.notion.site/Diagramas-Exp-Criativa-214ce75fe5118088b621f246c4d320c8)
