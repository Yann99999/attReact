
import { useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';
import './dashboard.css'
import { FiMessageSquare, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom';

export default function Dashboard(){

  const [chamados, setChamdos] = useState([]);



  return(
    <div>
      <Header/>

      <div className='conteudo'>
        <Title name="Atendimentos">
          <FiMessageSquare size={25}/>
        </Title>

        {chamados.length == 0 ? ( 
        <div className='container dashboard'>
          <span>Nenhum chamado registrado...</span>
          <Link to="/novo" className="novo">
          <FiPlus size={25} color="white"/>
          Novo Chamado 
          </Link>
        </div>
        ) : (
          <>
          <Link to="/novo" className="novo">
          <FiPlus size={25} color="white"/>
          Novo Chamado 
          </Link>
          </>
        )}
        
      </div>
    </div>
  )
}