
import { useState, useEffect, useContext } from 'react';

import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';

import './new.css'
import { FiPlusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify';

export default function New(){
  
  const [loadCustomers, setLoadCustomers] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [clienteEscolhido, setClienteEscolhido] = useState(0);

  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');

  const { user } = useContext(AuthContext);


  useEffect(()=> {
    async function loadCustomers(){
      await firebase.firestore().collection('clientes')
      .get()
      .then((snapshot)=>{
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })

        if(lista.length === 0){
          console.log('NENHUMA EMPRESA ENCONTRADA');
          setClientes([ { id: '1', nomeFantasia: '...' } ]);
          setLoadCustomers(false);
          return;
        }

        setClientes(lista);
        setLoadCustomers(false);

      })
      .catch((error)=>{
        console.log('DEU ALGUM ERRO!', error);
        setLoadCustomers(false);
        setClientes([ { id: '1', nomeFantasia: '' } ]);
      })

    }

    loadCustomers();

  }, []);


  async function registrarChamado(e){
    e.preventDefault();
    await firebase.firestore().collection('chamados')
    .add({
      created: new Date(),
      cliente: clientes[clienteEscolhido].nomeFantasia,
      clienteId: clientes[clienteEscolhido].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid
    })
    .then(()=>{
      toast.success('Chamado cadastrado com sucesso')
      setComplemento('')
      setClienteEscolhido(0)
    })
    .catch((erro)=>{
      console.log(erro)
      toast.error('Erro ao registrar chamado')
    })
  }


  //Chamado quando troca o assunto
  function mudarAssunto(e){
    setAssunto(e.target.value);
  }


  //Chamado quando troca o status
  function mudarStatus(e){
    setStatus(e.target.value);
  }

  //Chamado quando troca de cliente
  function mudarClientes(e){
    //console.log('INDEX DO CLIENTE SELECIONADO: ', e.target.value);
    //console.log('Cliente selecionado ', customers[e.target.value])
    setClienteEscolhido(e.target.value);
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">

          <form className="form-profile"  onSubmit={registrarChamado} >
            
            <label>Cliente</label>

            {loadCustomers ? (
              <input type="text" disabled={true} value="Carregando clientes..." />
            ) : (
                <select value={clienteEscolhido} onChange={mudarClientes} >
                {clientes.map((item, index) => {
                  return(
                    <option key={item.id} value={index} >
                      {item.nomeFantasia}
                    </option>
                  )
                })}
              </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={mudarAssunto}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input 
              type="radio"
              name="radio"
              value="Aberto"
              onChange={mudarStatus}
              checked={ status === 'Aberto' }
              />
              <span>Em Aberto</span>

              <input 
              type="radio"
              name="radio"
              value="Progresso"
              onChange={mudarStatus}
              checked={ status === 'Progresso' }
              />
              <span>Progresso</span>

              <input 
              type="radio"
              name="radio"
              value="Atendido"
              onChange={mudarStatus}
              checked={ status === 'Atendido' }
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (opcional)."
              value={complemento}
              onChange={ (e) => setComplemento(e.target.value) }
            />
            
            <button type="submit">Registrar</button>

          </form>

        </div>

      </div>
    </div>
  )
}