import './perfil.css';
import avatar from '../../assets/avatar.png'
import Header from '../../components/Header';
import Title from '../../components/Title';
import  { FiSettings, FiUpload } from 'react-icons/fi';

import { toast } from 'react-toastify';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';

export default function Perfil(){
    const { user, signOut, setUser, storageUser } = useContext(AuthContext);
    
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]

            if(image.type === 'image/jpe-g' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))
            }else{
                alert('Envie uma imagem com formato PNG ou JPEG')
                setImageAvatar(null);
                return null;
            }
        }
    }
    async function handleUploadImage(){
        const idAtual = user.uid;

        const uploadImage = await firebase.storage()
        .ref(`images/${idAtual}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then( async ()=>{
            console.log('foto enviada')

            await firebase.storage().ref(`images/${idAtual}`)
            .child(imageAvatar.name).getDownloadURL()
            .then( async (url)=>{
                let urlImage = url;
                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: urlImage,
                    nome: nome
                }).then(()=>{
                    let data = {
                        ...user,
                        avatarUrl: urlImage,
                        nome: nome
                    };
                    setUser(data)
                    storageUser(data)
                })
            })
        })
    }
    async function handleSubmit(e){
        e.preventDefault()

        if(imageAvatar === null && nome !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome : nome
            })
            .then(()=>{
                let data = {
                    ...user,
                    nome: nome
                }
                setUser(data);
                storageUser(data);
                toast.success('Nome atualizado');
                
            })
            .catch((error)=>{
                toast.error(error)
            })
        }else if(nome !=='' && imageAvatar !== null){
            handleUploadImage();
        }
    }

    return(
        <div>
            <Header/>

            <div className='conteudo'>
                <Title name="Meu Perfil">
                    <FiSettings size={25}/>                                                                                                              
                </Title>

                <div className='container'>
                    <form className='form-perfil' onSubmit={handleSubmit}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload size={25} color="white"/>
                            </span>
                            <input type="file" accept="image/*" onChange={handleFile} />
                            { avatarUrl === null ? 
                            <img src={avatar} width="250" alt='foto de perfil do usuário'/>
                            :
                            <img src={avatarUrl} width="250" alt='foto de perfil do usuário'/>
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={ (e) => setNome(e.target.value)} />
                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />

                        <button type="submit">Salvar</button>
                    </form>
                </div>

                <div className='container'>
                    <button className='logout-btn' onClick={ () => signOut() }>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}