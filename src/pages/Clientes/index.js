import './clientes.css'
import Title from '../../components/Title'
import Header from '../../components/Header'
import { FiUser } from 'react-icons/fi'
import { useState } from 'react'
import firebase from 'firebase'
import { toast } from 'react-toastify'

export default function Clientes(){

    const [nomeCliente, setNomeCliente] = useState('');
    const [cnpjCliente, setCnpjCliente] = useState('');
    const [enderecoCliente, setEnderecoCliente] = useState('');

    async function addCliente(e){
        e.preventDefault();

        if(nomeCliente !== '' && cnpjCliente !== '' && enderecoCliente !== ''){
            await firebase.firestore().collection('clientes')
            .add({
                nomeEmpresa: nomeCliente,
                cnpj: cnpjCliente,
                endereco: enderecoCliente
            })
            .then(()=>{
                setNomeCliente('')
                setCnpjCliente('')
                setEnderecoCliente('')
                toast.info('Empresa cadastrada com sucesso')
            })
            .catch( (error)=>{
                toast.error('Impossível cadastrar a empresa')
                console.log(error)
            })
        }else{
            toast.error('Preencha todos os campo')
        }
    }
    return(
        <div>
            <Header/>
            
            <div className='conteudo'>
            <Title name="Clientes">
                <FiUser size={25}/>
            </Title>

            <div className='container'>
                <form className='form-perfil clientes' onSubmit={addCliente}>
                    <label>Nome</label>
                    <input type="text" placeholder="Nome da empresa... "value={nomeCliente} onChange= { (e) => setNomeCliente(e.target.value)}/>
                    
                    <label>CNPJ</label>
                    <input type="text" placeholder="Seu CNPJ... "value={cnpjCliente} onChange= { (e) => setCnpjCliente(e.target.value)}/>

                    <label>Endereço</label>
                    <input type="text" placeholder="Endereço da empresa... "value={enderecoCliente} onChange= { (e) => setEnderecoCliente(e.target.value)}/>
                
                    <button type="submit">Cadastrar</button>
                </form>
            </div>
            </div>    
        </div>

    )
}