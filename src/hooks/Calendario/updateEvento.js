  const handleUpdate = async () => {
    try {
      const updatedEvent = {
        ...event,
        title,
        type,
        desc,
        start, // já está como string no formato ISO
        end,
        important,
        color,
      };

      const docRef = doc(db, "eventos", event.id);
      await updateDoc(docRef, updatedEvent);

      const snapshot = await getDocs(collection(db, "eventos"));
      const updatedEvents = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });

      console.log("Eventos atualizados:", updatedEvents);

      if (onUpdateEvento) {
        onUpdateEvento(updatedEvent);
      }

      onClose();
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
    }
  };

export default updateEvento;