var tbody = document.querySelector('table tbody');
var new_user = {};
//GetUsuarios();

function Cadastrar(){ 

	var data = new Date();
	var mes = data.getMonth() +1;

	if(mes < 10){
		mes = "0" + String(mes);
	}
	
	new_user.nome          = document.querySelector('#nome').value; 
	new_user.cpf           = document.querySelector('#cpf').value; 
	new_user.rg            = document.querySelector('#rg').value; 
	new_user.filiacao_Mae  = document.querySelector('#filiacao_Mae').value;
	new_user.filiacao_Pai  = document.querySelector('#filiacao_Pai').value;
	new_user.dataNasc      = document.querySelector('#dataNasc').value;
	new_user.dataCadastro  = data.getDate()+"/"+(parseInt(data.getMonth()) + 1)+"/"+data.getFullYear(); 

	console.log(new_user.dataCadastro)
	
	if(validateDate(new_user.dataNasc)){
		if(new_user.id === undefined || new_user.id === 0)
			SalvarUsuarios('POST', 0, new_user);
		else
			SalvarUsuarios('PUT', new_user.id, new_user);

		BuscarUsuarios(new_user.cpf);

		$('#myModal').modal('hide')	
	}
	
}

function GetUsuarios(){
	tbody.innerHTML = '';
	var xhr = new XMLHttpRequest();


	xhr.open('GET', `http://localhost:27816/api/Usuario`, true);

	xhr.onload = function(){

		var users = JSON.parse(this.responseText);
		for(var indice in users){
			AddLinha(users[indice]);
		}
	}

	xhr.send();
}

function SalvarUsuarios(metodo, id, corpo){
	var xhr = new XMLHttpRequest();

	if(id === undefined || id === 0)
		id = '';

	xhr.open(metodo, `http://localhost:27816/api/Usuario/${id}`, false);

	console.log(corpo)
	xhr.setRequestHeader('content-type', 'application/json')
	xhr.send(JSON.stringify(corpo));
}

function AbrirModal(){
	var btnSalvar = document.querySelector('#btnSalvar');
	var btnCancelar = document.querySelector('#btnCancelar')
	var titulo = document.querySelector('#titulo')

	document.querySelector('#nome').value = '';
	document.querySelector('#cpf').value = '';
	document.querySelector('#rg').value = '';
	document.querySelector('#filiacao_Mae').value = '';
	document.querySelector('#filiacao_Pai').value = '';
	document.querySelector('#dataNasc').value = '';

	btnSalvar.textContent = 'Cadastrar';
	btnCancelar.textContent = 'Cancelar';
	titulo.textContent = 'Cadastrar Usuário';
	new_user ={};

	$('#myModal').modal('show')
}


function AddLinha(user){
	console.log(user.cpf)
	var trow = `<tr>
	<td>${user.id}</td>
	<td>${user.nome}</td>
	<td>${user.cpf}</td>
	<td>${user.rg}</td>
	<td>${user.dataNasc}</td>
	<td>
	<button onclick = 'EditarUser(${JSON.stringify(user)})' class="btn btn-primary" data-toggle="modal" data-target="#myModal">Editar</button>
	<button onclick = 'Excluir(${JSON.stringify(user)})' class="btn btn-danger">Remover</button>
	<button onclick = 'Consultar(${JSON.stringify(user)})' class="btn btn-info data-toggle="modal" data-target="#myModalConsulta"">Consultar</button> 
	</td>
	</tr>
	`
	tbody.innerHTML += trow;
}

function FecharModalConsulta(){
	$('#myModalConsulta').modal('hide');
}

function EditarUser(user){
	var btnSalvar = document.querySelector('#btnSalvar');
	var btnCancelar = document.querySelector('#btnCancelar')
	var titulo = document.querySelector('#titulo');

	document.querySelector('#nome').value = user.nome;
	document.querySelector('#cpf').value = user.cpf;
	document.querySelector('#rg').value = user.rg;
	document.querySelector('#filiacao_Mae').value = user.filiacao_Mae;
	document.querySelector('#filiacao_Pai').value = user.filiacao_Pai;
	document.querySelector('#dataNasc').value = user.dataNasc;

	btnSalvar.textContent = 'Salvar';
	btnCancelar.textContent = 'Cancelar';
	titulo.textContent = `Editar Usuário : ${user.nome}`;

	new_user = user;
}

function Cancelar() {
	var btnSalvar = document.querySelector('#btnSalvar');
	var btnCancelar = document.querySelector('#btnCancelar')
	var titulo = document.querySelector('#titulo')

	document.querySelector('#nome').value = '';
	document.querySelector('#cpf').value = '';
	document.querySelector('#rg').value = '';
	document.querySelector('#filiacao_Mae').value = '';
	document.querySelector('#filiacao_Pai').value = '';
	document.querySelector('#dataNasc').value = '';

	btnSalvar.textContent = 'Cadastrar';
	btnCancelar.textContent = 'Cancelar';
	titulo.textContent = 'Cadastrar Usuário';
	new_user ={};

	$('#myModal').modal('hide')
}

function RemoverUser(id){
	var xhr = new XMLHttpRequest();
	xhr.open('DELETE', `http://localhost:27816/api/Usuario/${id}`, false);

	xhr.send();
}

function Consultar(user){
	var titulo = document.querySelector('#tituloConsulta');
	var id   = document.querySelector('#idConsulta');
	var nome = document.querySelector('#nomeConsulta');
	var cpf  = document.querySelector('#cpfConsulta');
	var rg   = document.querySelector('#rgConsulta');
	var mae  = document.querySelector('#maeConsulta');
	var pai  = document.querySelector('#paiConsulta');
	var nasc = document.querySelector('#nascConsulta');
	var cad  = document.querySelector('#cadastroConsulta');

	id.textContent = user.id;
	nome.textContent = user.nome;
	cpf.textContent = user.cpf;
	rg.textContent = user.rg;
	mae.textContent = user.filiacao_Mae;
	pai.textContent = user.filiacao_Pai;
	nasc.textContent = user.dataNasc;
	cad.textContent = user.dataCadastro;
	
	titulo.textContent = `Consultar Usuário : ${user.nome}`;
	$('#myModalConsulta').modal('show')
}

function BuscarUsuarios(busca){

	if(busca !== ''){
		if(busca === undefined)
			busca = document.querySelector('#busca').value;

		tbody.innerHTML = '';
		var xhr = new XMLHttpRequest();


		xhr.open('GET', `http://localhost:27816/api/Usuario/filtro/${busca}`, false);

		xhr.onload = function(){

			var users = JSON.parse(this.responseText);
			for(var indice in users){
				AddLinha(users[indice]);
			}
		}

		xhr.send();	
	}
	
}

function validateDate(data) {
	var check = data.split("/");
	console.log(check);	

	if(parseInt(check[0]) === 0 || parseInt(check[0]) > 31 || parseInt(check[1]) > 12 || parseInt(check[3]) < 1920 || parseInt(check[3]) > 2010)
	{	
		bootbox.alert(`A data de nascimento: ${data} não é válida?`);
		return false;
	}
	else
		return true;
}

function Excluir(user){
	bootbox.confirm({
		message: `Tem certeza que deseja excluir ${user.nome}?`,
		buttons: {
			confirm: {
				label: 'Sim',
				className: 'btn-success'
			},
			cancel: {
				label: 'Não',
				className: 'btn-danger'
			}
		},
		callback: function (result) {
			if(result){
				RemoverUser(user.id);
				GetUsuarios();	
			}
		}
	});
}
