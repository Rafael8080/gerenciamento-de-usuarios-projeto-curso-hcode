class User {
    
    constructor (name, gender, birth, country, email, password, photo, admin) {

        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }

    //Os beneficios de usar os getters, é que vc pode chamar o atributo e ainda fazer algum tipo de validação
    //Por exemplo. se eu quero calcular a area de um quadrado, eu posso criar um metodo area, e calcular a a altura e lagura e retornar area
    //Além de que, a informação fica mais protegida.


    get register() {
        return this._register;
    }

    get name() {
        return this._name;
    }

      get gender() {
        return this._gender;
    }

      get birth() {
        return this._birth;
    }

      get country() {
        return this._country;
    }

      get email() {
        return this._email;
    }

      get password() {
        return this._password;
    }

      get admin() {
        return this._admin;
    }

    get photo(){
        return this._photo;
    }

    set photo(value) {
        this._photo = value;
    }

}