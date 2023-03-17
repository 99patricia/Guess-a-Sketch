
import { doc, collection, query, where, addDoc, getDoc,getDocs, setDoc, updateDoc, deleteDoc, arrayUnion} from "firebase/firestore"; 

///////////////////////////// getWordBankNames /////////////////////////////
async function getWordBankNames(app, db) {
    app.get('/wordbank', async (req, res) => {
        try {
            const wordBankCollection = collection(db, 'wordBank');
            const wordBankSnapshot = await getDocs(wordBankCollection);
            const wordBankNames = wordBankSnapshot.docs.map(doc => doc.id);

            res.status(200).json(wordBankNames);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch word bank names' });
        }
    });
}


///////////////////////////// getWordBankContent /////////////////////////////
async function getWordBankContent(app, db) {
    app.get('/wordbank/:name_wordbank', async (req, res) => {
      try {
        const name_wordbank = req.params.name_wordbank;
  
        const wordBankDocRef = doc(db, 'wordBank', name_wordbank);
  
        // Fetch the document
        const snapshot = await getDoc(wordBankDocRef);
        if (snapshot.exists()) {
          // If the document exists, send the content as the response
          res.status(200).json(snapshot.data().words);
        } else {
          res.status(404).json({ error: 'Word bank not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch word bank content' });
      }
    });
  }



///////////////////////////// createWordBank /////////////////////////////
async function createWordBank(app, db) {
    app.post('/wordbank/:name_wordbank', async (req, res) => {
      try {
        const name_wordbank = req.params.name_wordbank;
        const bankname = req.body['bankname'];
        const words = req.body['words'];
  
        const wordBankDocRef = doc(db, 'wordBank', name_wordbank);
        
        // Check if the document already exists
        const snapshot = await getDoc(wordBankDocRef);
        if (snapshot.exists()) {
          res.status(400).json({ error: 'Word bank already exists' });
          return;
        }
        
        // If the document doesn't exist, create a new one
        const wordBankData = { bankname, words };
        await setDoc(wordBankDocRef, wordBankData);
        res.status(200).json({ message: 'Word bank created successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create word bank' });
      }
    });
  }



export function init(app, db) {
  getWordBankNames(app,db),
  getWordBankContent(app,db),
  createWordBank(app,db)
}