//import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db } from '../FireBase/firebaseconfig.js';

export const eventos = [];

// Função para buscar eventos do Firestore e adicionar eventos locais
export const fetchEventos = async () => {
  try {
    const eventosRef = collection(db, "eventos");
    const snapshot = await getDocs(eventosRef);

    const eventosFormatados = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const formatDate = (d) => {
        if (!d) return "";

        // Se for Timestamp do Firestore
        if (typeof d === "object" && typeof d.toDate === "function") {
          return d.toDate().toISOString().slice(0, 16);
        }

        // Se for string que representa data
        const date = new Date(d);
        if (!isNaN(date)) {
          return date.toISOString().slice(0, 16);
        }

        // Qualquer outro caso, retorna vazio
        return "";
      };

      return {
        id: docSnap.id,
        title: data.title,
        start: formatDate(data.start),
        end: formatDate(data.end),
        color: data.color,
        type: data.type,
        important: data.important,
        desc: data.desc,
      };
    });

    return eventosFormatados;
  } catch (error) {
    console.error("Erro ao buscar eventos do Firestore:", error);
    return [];
  }
};


// Função para adicionar evento no Firestore
export const addEvento = async (evento) => {
  try {
    const eventosRef = collection(db, "eventos");
    const docRef = await addDoc(eventosRef, evento);
    return { id: docRef.id, ...evento }; // Retorna evento com o ID do Firestore
    
  } catch (error) {
    console.error("Erro ao adicionar evento:", error);
  }
};