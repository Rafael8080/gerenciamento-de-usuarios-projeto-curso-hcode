class Utils{

	//Um metodo estático, é um metodo onde eu não preciso instaciar. eu chamo direto pelo o nome da classe
	static dateFormat(date){

		return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();

	}

}