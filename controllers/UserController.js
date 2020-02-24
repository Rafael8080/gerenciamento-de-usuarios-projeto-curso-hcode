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
                

                /*
                    Resumo
                    O método then() retorna uma Promise. Possui dois argumentos, ambos são "call back functions", sendo uma para o sucesso e outra para o fracasso da promessa.
                */
                this.getPhoto().then( (content) => {

                    values.photo = content;

                    this.addLine(values);

                }, (e) => {
                
                    console.error(e);

            }

            
         );

        
    });

}


    getPhoto(){

        return new Promise( (resolve, reject) => {

                        //Filtrando o campo foto
            let elements = [...this.formEl.elements].filter(item => {

                if (item.name === 'photo') {
                    return item;
                }

            });

            let fileReader = new FileReader();

        
            let file = elements[0].files[0];

            fileReader.onload = () => {

                resolve(fileReader.result);

            };

            fileReader.onerror = (e) => {

                reject(e);

            }


          if(file) {

              fileReader.readAsDataURL(file);

          }
           else{

            resolve('dist/img/boxed-bg.jpg');

          }

    });
            
        

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
        
            } 
            else if(field.name == "admin") {

                user[field.name] = field.checked;

            }
            else {
                
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
        
  let tr = document.createElement('tr');
 tr.innerHTML = `
      <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
      <td>${dataUser.name}</td>
      <td>${dataUser.email}</td>
      <td>${(dataUser.admin) ? 'sim' : 'não'}</td>
      <td>${dataUser.birth}</td>
      <td>
          <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
          <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
      </td>
 `;
this.tableEl.appendChild(tr);
    }

}//Fecha classe