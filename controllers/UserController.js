class UserController {

    constructor (formId, tableId) {

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();

    }

//DATE
//new Date() //Data atual
//new Date(2018, 4, 5) //Retorna o mês de maio, pois o mes em javascript é contado a partir do 0
// new Date([2018, 4, 5]) //Passando o array, ele me retorna os valores igual a data normal
//new Date("2018-04-05") // Se eu passar desta forma sem especificar as horas, ele vai me retornar 00:00:00 - 3 horas pois a gente tá treês horas do horario GMT
//new Date("2018-01-01 00:00:00") //Aqui ele vai retornar a data e os milisegundos da forma em que eu passei
    onSubmit(){
    

      this.formEl.addEventListener("submit", (event) => {

                event.preventDefault();

                let btn = this.formEl.querySelector("[type=submit]");
                btn.disabled = true;
                let values = this.getValues();              

                /*
                    Resumo
                    O método then() retorna uma Promise. Possui dois argumentos, ambos são "call back functions", sendo uma para o sucesso e outra para o fracasso da promessa.
                */
                this.getPhoto().then( (content) => {

                    values.photo = content;

                    this.addLine(values);
                    this.formEl.reset();

                    btn.disabled = false;

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
      <td>${Utils.dateFormat(dataUser.register)}</td>
      <td>
          <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
          <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
      </td>
 `;
this.tableEl.appendChild(tr);
    }

}//Fecha classe