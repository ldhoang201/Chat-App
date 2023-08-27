import React, { useState, useEffect } from "react"
import { db } from "../firebase/config";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";


const useFirestore = (collectionName, condition) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const collectionRef = collection(db, collectionName);
        let q = query(collectionRef);
        if (condition) {
            if (condition.compareValue?.length === 0 || !condition.compareValue) {
                return;
            }
            q = query(collectionRef, where(condition.fieldName, condition.operator, condition.compareValue));
        }



        const unsubscribe = onSnapshot(q, (snapshot) => {
            const documents = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setDocuments(documents);
        });

        // Clean up function
        return () => unsubscribe();
    }, [collectionName, condition]);

    return documents;
}

export default useFirestore;