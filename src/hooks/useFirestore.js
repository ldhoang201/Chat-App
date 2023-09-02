import React, { useState, useEffect } from "react"
import { db } from "../firebase/config";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";


const useFirestore = (collectionName, condition) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const collectionRef = collection(db, collectionName);
        let q = query(collectionRef);

        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                setDocuments([]);
                return;
            }

            else {
                q = query(collectionRef, where(condition.fieldName, condition.operator, condition.compareValue),orderBy('createdAt'));
            }
        }


        const unsubscribe = onSnapshot(q, (snapshot) => {
            const documents = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            console.log(documents);
            setDocuments(documents);
        });

        // Clean up function
        return () => unsubscribe();
    }, [collectionName, condition]);


    return documents;
}

export default useFirestore;