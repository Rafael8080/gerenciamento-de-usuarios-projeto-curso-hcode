class UserController {

    constructor (formId, tableId) {

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();

    }


    onSubmit(){
    

      this.formEl.addEventListener("submit", (event) => {

            event.preventDefault();

            let values = this.getValues();

            values.photo = "";
            
            this.getPhoto( content => {

                values.photo = content;

                this.addLine(values);

            });

        
        });

    }


    getPhoto(callback){

       //Filtrando o campo foto
       let elements = [...this.formEl.elements].filter(item => {

            if (item.name === 'photo') {
                return item;
            }

        });

        let fileReader = new FileReader();

        //Aqui, elements é um array com um inten, um array com todos itens que atendem
        //a condição da variavel elements. o elements[0] seria o item desse campo o usuario selecionou o campo file, selecionou um arquivo , 
        //e eu tô pegando o arquivo que o usuario selecionou, que nesse caso é uma foto
        //Ou seja, o elements e o file é uma coleção, e eu preciso selecionar os campos que me interessa
        let file = elements[0].files[0];

        //CallBack é uma função usada como retorno após a execução de uma rotina. nesse caso, será recarregar a photo
        //Ou seja, quando o o onload terminar de ler a foto, vai chamar a função de callback passando o resultado do caminho do arquivo
        fileReader.onload = () => {

            //Essa função de callback, ler o conteúdo dá do campo fil, ela pega o caminho do arquivo que o usuario pegou
            callback(fileReader.result);

        };
        //O aqrquivo que vai ser lido
        fileReader.readAsDataURL(file);

    }

    getValues(){

        let user = {};

        //Reticencias = spred, ele espalha , coloca uma virgula em cada elemento desse array, por que lembra que tinhamos uma coleção de objetos? agora temos uma coleção de arrays
        //Para espalhar esses carinhas ultilizamos o spred
        //Resumindo: forEach não combina com
        [...this.formEl.elements].forEach(function(field, index){

            if(field.name == 'gender'){
        
                if(field.checked){
                    user[field.name] = field.value;             
                }
        
            } else {
                
                user[field.name] = field.value;
        
            }
            
        });
        
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

    addLine (dataUser) {
        console.log(dataUser)
           //Template String
   //Aqui estou acesando os dados do objeto datauser
  this.tableEl.innerHTML = `
  <tr>
      <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
      <td>${dataUser.name}</td>
      <td>${dataUser.email}</td>
      <td>${dataUser.admin}</td>
      <td>${dataUser.birth}</td>
      <td>
          <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
          <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
      </td>
  </tr>
 `;

    }

}//Fecha classe