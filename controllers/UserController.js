class UserController {

    constructor (formIdCreate, formIdUpdate, tableId) {

        //Inicializando o meu construtor Selecionando o formulario
        this.formEl = document.getElementById(formIdCreate);
        //Inicializando o meu construtor selecionando a minha tabela
        this.tableEl = document.getElementById(tableId);
        //Chamando o meu metodo onSubmit
        this.onSubmit();

        this.formUpdateEl = document.getElementById(formIdUpdate);

        //Cancela a edição do formulario
        this.onEdit();

    }

    //Esse trecho de código, cancela a edição do formulario
    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", ()=>{

            //Mostra o formulario de cadastro na tela
            this.showPanelCreate();

        });
        

        this.formUpdateEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");
            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl); 

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);
            console.log("Userooooooollllllddddddddd", userOld)
            //Aqui, no assign, como as propriedades tem o mesmo nome, os valores serão substituidos. o values como tá na direita, vai ter prioridade nessa substiruição.
            let result = Object.assign({}, userOld, values);
            console.log("RESUUUUUUUUUUUULTTTTTTT", result);

            this.getPhoto(this.formUpdateEl).then( (content) => {

            //Essa condição diz: se o campo values.photo estiver vazio, deixe ele com o valor antigo
            // | if(!values.photo) result._photo = userOld._photo;

                if(!values.photo) {
                    result._photo = userOld._photo;
                } else{
                    result._photo = content;
                }

                tr.dataset.user = JSON.stringify(result);

                tr.innerHTML = `
                <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${result._name}</td>
                <td>${result._email}</td>
                <td>${(result._admin) ? 'sim' : 'não'}</td>
                <td>${Utils.dateFormat(result._register)}</td>
                <td>
                    <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;
            

                this.addEventsTr(tr);

                this.updateCount();
                
                this.formUpdateEl.reset();

                this.showPanelCreate();

                //Habilitando botão pra adicionar novos dados
                btn.disabled = false;

            }, (e) => {
                
                //Se tudo deu errado, mostre um erro no console
                console.error(e);

        }

        
     );

        });

    }

//DATE
//new Date() //Data atual
//new Date(2018, 4, 5) //Retorna o mês de maio, pois o mes em javascript é contado a partir do 0
// new Date([2018, 4, 5]) //Passando o array, ele me retorna os valores igual a data normal
//new Date("2018-04-05") // Se eu passar desta forma sem especificar as horas, ele vai me retornar 00:00:00 - 3 horas pois a gente tá treês horas do horario GMT
//new Date("2018-01-01 00:00:00") //Aqui ele vai retornar a data e os milisegundos da forma em que eu passei
    onSubmit(){
    
      //Quando esse formulario ouvir disparar um evento do tipo submit ele vai realizar as seguintes operações...
      this.formEl.addEventListener("submit", (event) => {

                //Aqui estou pedindo para o meu formulario parar com todos os seus comportamentos padrão
                event.preventDefault();

                //Aqui estou selecionando o meu botão que é do tipo submit, esse botão, é pra evitar duplicações de do mesmo usuario no nosso formulario
                let btn = this.formEl.querySelector("[type=submit]");
                btn.disabled = true;

                //Aqui estou recebendo os meu dados OU um false(Resultante de que o meu formulario é vazio)
                let values = this.getValues(this.formEl);              

                /*
                    Resumo
                    O método then() retorna uma Promise. Possui dois argumentos, ambos são "call back functions", sendo uma para o sucesso e outra para o fracasso da promessa.
                */
               //Se o values está vazio, não tem necessidade de prosseguir com as instruçoes abaixo. Assim teremos o minimo de segurança possivel nesse cenário
               if(!values) return false;

               //Aqui estou retornando o resultado da promessa, chamando um metodo e passndo dois callbacks pra esse metodo, um que termina de resolver a promessa adicionando os valores ao addline...
               //E outro que mostra um erro se ocorreu um erro
                this.getPhoto(this.formEl).then( (content) => {

                    //Adicionando o caminho da foto no campo photo
                    values.photo = content;

                    //Adiciona os valores ao na tabela
                    this.addLine(values);

                    //Limpado formulario
                    this.formEl.reset();

                    //Habilitando botão pra adicionar novos dados
                    btn.disabled = false;

                }, (e) => {
                    
                    //Se tudo deu errado, mostre um erro no console
                    console.error(e);

            }

            
         );

        
    });

}


    getPhoto(formEl){

        //Este Metodo, vai retornar uma promessa(Uma classe promessa), com um callback como parametro...
        return new Promise( (resolve, reject) => {

                        //Filtrando o campo foto
            let elements = [...formEl.elements].filter(item => {
                //Retornando esse item pra quem chamar
                if (item.name === 'photo') {
                    return item;
                }

            });
            //Instanciando a classe FileReader
            let fileReader = new FileReader();

            //Aqui estou pegando o nome do arquivo que foi lido
            let file = elements[0].files[0];

            //Aqui estou dizendo que quando terminar de carregar se deu tudo certo, vai fazer alguma coisa...
            fileReader.onload = () => {
                //Essa coisa, é mandar o resultado resolvido dessa promessa pra quem chamou
                resolve(fileReader.result);

            };

            //Aqui estou dizendo que se der um erro, a promessa vai ser rejeitada, e retornará um pre quem chamar
            fileReader.onerror = (e) => {
                reject(e);
            }

          //Aqui eu vou resolver com uma imagem padrão pra ser adicionada
          if(file) {

              fileReader.readAsDataURL(file);

          }
           else{

            //Se eu tiver esquecido de escolher um arquivo pra mandar fileReader.result, ele vai resolver com o caminho de uma imagem padrão.
            resolve('dist/img/boxed-bg.jpg');

          }

    });
            
        

    }

    getValues(formEl){

        let user = {};

        //Essa variavel isvalid é pra auxiliar se alguns campos do formulario estão vazio
        let isValid = true;

        //Reticencias = spred, ele espalha , coloca uma virgula em cada elemento desse array, por que lembra que tinhamos uma coleção de objetos? agora temos uma coleção de arrays
        //Para espalhar esses carinhas ultilizamos o spred
        //Resumindo: forEach não combina com objetos, pois é um metodo de array
        [...formEl.elements].forEach((field, index) => {

            //Esse if é pra verificar se essas string name, email e password estão vazios
            //Se entrar aqui nesse if, quer dizer que está vazio e se está vasio quer dizer isvalid = false
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

               field.parentElement.classList.add('has-error');
                isValid = false;

            }
            //Aqui é pra filtrar o campo gender
            if(field.name == 'gender'){
                //Aqui pra verificar se esse campo está checkado
                if(field.checked){
                    //Aqui é pra pegar o valor desse campo que está checkado
                    user[field.name] = field.value;             
                }
        
            } 
            //Aqui estou verificando se ele um campo do tipo adimin
            else if(field.name == "admin") {
                //Aqui é pra pegar o valor desse campo que está checkado
                user[field.name] = field.checked;

            }
            else {
                //Aqui é pra pegar os elementos que não atenderam a essa condição
                user[field.name] = field.value;
        
            }
            
        });
        //Se isvalid for falso, ele entra no if e retorna falso, se for verdadeiro e ele vai retornar a classe User pra quem chamar
        if(!isValid) {
            return false;
        }
        
        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country,
            user.email, 
            user.password,
            user.photo, 
            user.admin
        );

      
    }

    addEventsTr(tr){

        //Pegue o item que foi clicado, pessa confirmação ao usuario, e se for true, remova a tr do lista 
        tr.querySelector(".btn-delete").addEventListener("click", e=> {

            if(confirm("Deseja realmente excluir?")){

                tr.remove();
                
                this.updateCount();

            }
            

        });

        //Pegando a table row que foi adicionada na tabela, adcionando um evento de click...
        //Essa ação, diz que quando a tr receber um click ele vai trocar o formulario de criação e colocar o formulario de edição de dados
        tr.querySelector(".btn-edit").addEventListener("click", e=>{
            //Aqui estou convertendo para um objeto javascript
        let json = JSON.parse(tr.dataset.user);

        //Armazenando o index da linha em um dataset do formulario
        this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

        //Aqui temos um for in, que tá percorrendo o meu objeto json...
        //O for significa para cada, e a variavel name significa o elemento em questão, por que não se esqueçã de que o for in...
        //É um loop ele tá percorrendo a variavel json que tem um objeto com os dados do meu usuario
        for(let name in json){
        //O json é um objeto comum, assim está pegando apenas os atributos que forma passados.
        //Aqui estou procurando os campos, e estou tirando o underline padrão no formulario "#form-user-update"
        let field = this.formUpdateEl.querySelector("[name="+name.replace("_", "")+"]");

        //Verifico se o campo existe no formulario
        if(field) {
                //Se o tipo do campo for:
        switch(field.type){

            //Se o input for do tipo radio, apenas continue, pois não é possivel file.type ser tratado com value
            case 'file':
            continue;
            break;

            //Caso seja radio
            case 'radio':
                //Aqui, ele tá pegando o valor que está sendo alimentado ou por M ou por f no caso o atributo value
                field = this.formUpdateEl.querySelector("[name="+name.replace("_", "")+"][value="+json[name]+"]");
                field.checked = true;
            break;

            //Se está checkado é true, se não está checkado, é false
            case 'checkbox':
                //Pegando a propriedade do meu do meu json, nunca se esqueça que os indices do json , são as propriedades do meu...
                //Objeto, diferente do array, que os indices começam com[0, 1, 2...e assim por diante]
                field.checked = json[name];
            break;

                //Se for de qualquer outro tipo o campo, excute o default+
            default:
                field.value = json[name];

        }

        field.value = json[name];
        }
        //O relplace serve pra tirar o underline do campo, pra fazer comparação com a instancia da classe, a intancia da classe está sendo chamada pelo o getter...

        }

        this.formUpdateEl.querySelector(".photo").src = json._photo;

        this.showPanelUpdate();


        });

    }

    addLine (dataUser) {
//Aqui estou criando a table roww que será inserida na minha table é l que no html é meu tbody
  let tr = document.createElement('tr');

  //Ultilizando o dataset
  //Dataset só guarda String

  //Convertendo um Json para String
  //Aqui estou adicionando um dataset a minha tag html tr, ela é está guardando as informações que foram enviadas até o momento e como o dataset não suporta o tipo object apenas Strings...
 //Estou serializando os meu dados , ou seja estou convertendo o meu Json em String, pois precisarei dessa informação mais na frente
 //Aqui estou convertendo pra json
 tr.dataset.user = JSON.stringify(dataUser);
//Aqui Estou adicionando as minhas tables data (td) a table row (tr)
 tr.innerHTML = `
      <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
      <td>${dataUser.name}</td>
      <td>${dataUser.email}</td>
      <td>${(dataUser.admin) ? 'sim' : 'não'}</td>
      <td>${Utils.dateFormat(dataUser.register)}</td>
      <td>
          <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
          <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
      </td>
 `;

 this.addEventsTr(tr);
 
 //Aqui estou acrescentando um usuario a minha tabela , se eu usasse o innerHTML, ele iria substituir as informações
this.tableEl.appendChild(tr);

        //Aqui estou fazendo a contagem de todos usuarios, e fazendo a contagem de quantos adiministradores tem
        this.updateCount();


    }
    //Mostra o formulario de criação de dados
    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    }
    //Mostra o formulario de atualização de dados
    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }

    updateCount(){

        //childElementCount, é igual quantidade de filhos deste elmento
        //cildren, é igual a coleção de elemento, ous eja cada filho desse pai

        let numberUsers = 0;
        let numberAdmin = 0;

        //Children é  a coleção total dessa tabela, transformei ela em um array, e em seguida fiz ospred, colacando elemento em uma posição, fiz um forEach e fui adicionando os usuarios comuns...
        //Na variavel numberUsers++
        [...this.tableEl.children].forEach( tr => {

            //Quantidade total de usuarios no sistema
            numberUsers++;

            //Convertendo uma String pra JSON
           let user = JSON.parse(tr.dataset.user);

           //Aqui, eu estou acessando pra ver se existe um admin...
           //Por que eu não acessei user.admin como getter normal? por que quando eu converto o meu JSON-OBjeto pra string e depois converto essa string pra JSON novamente...
           //Esse JSON não é mais instancia de nenhuma classe eu apenas estou acessaando os atributos desse objeto e não mais os seus getters e setters
           if(user._admin){
               //Se entrou no if, estou incrementando a contagem de adiministradores nessa página
               numberAdmin++;

           }

           //Aqui, estou selecionando os elementos adicionando as variaveis com a quantidade atual de usuarios e adiministradores
           document.querySelector("#number-users").innerHTML = numberUsers;
           document.querySelector("#number-users-admin").innerHTML = numberAdmin;


        });


    }
    

}//Fecha classe