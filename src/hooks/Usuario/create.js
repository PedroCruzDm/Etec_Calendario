import { db_User, auth } from '../../firebase/firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth } from 'firebase/auth';

export class User{
    constructor (nome, tipo_user, email, senha, Count_events, img_user, id){
        this.id = id;
        this.nome = nome_user;
        this.img_user = img_user;
        this.tipo_user = tipo_user;
        this.Count_events = Count_events;
        this.email = email;
        this.senha = senha;
    }
}

export class Aluno extends User{
   constructor(permission_Func){
        this.permission_Func = permission_Func;
   }
}

export const Cadastrar_User = () => {}