
import { doc, collection, query, where, addDoc, getDoc,getDocs, setDoc, updateDoc, deleteDoc, arrayUnion} from "firebase/firestore"; 

///////////////////////////// getUserProfile /////////////////////////////
async function getUserProfile(app, db) {
    app.get('/profile/:id', async (req, res) => {
      try {
        const id = req.params.id;
  
        const profileDocRef = doc(db, 'profiles', id);
  
        // Fetch the document
        const snapshot = await getDoc(profileDocRef);
        if (snapshot.exists()) {
          // If the document exists, send the content as the response
          res.status(200).json(snapshot.data());
        } else {
          res.status(404).json({ error: 'Profile not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch profile' });
      }
    });
  }

///////////////////////////// upsertUserProfile /////////////////////////////
// Here only updated the currency, which can be modified later
async function upsertUserProfile(app, db) {
    app.post('/profile/:id', async (req, res) => {
      try {
        const id = req.params.id;
  
        const currency = req.body['currency'];
  
        const profileDocRef = doc(db, 'profiles', id);
  
        const snapshot = await getDoc(profileDocRef);
        let profileData = {};
        if (snapshot.exists()) {
          // Get the existing profile data and add the new win, loss, and currency values
          profileData = snapshot.data();
          profileData.currency += currency;
        } else {
            // If the profile doesn't exist, create a new one
            res.status(400).json({ error: 'Profile not exists' });
            return;
        }
  
        // Update the profile if it exists or create a new one if it doesn't
        await setDoc(profileDocRef, profileData, { merge: true });
  
        res.status(200).json({ message: 'Profile upserted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upsert profile' });
      }
    });
  }

///////////////////////////// UpdateProfileEndgame /////////////////////////////
async function UpdateProfileEndgame(app, db) {
    app.post('/endgame/:id', async (req, res) => {
      try {
        const id = req.params.id;
        
        const win = req.body['win'];
        const loss = req.body['loss'];
        const currency = req.body['currency'];

        const profileDocRef = doc(db, 'profiles', id);
  
        const snapshot = await getDoc(profileDocRef);
        let profileData = {};
        if (snapshot.exists()) {
          // Get the existing profile data and add the new win, loss, and currency values
          profileData = snapshot.data();
          profileData.win += win;
          profileData.loss += loss;
          profileData.currency += currency;
        } else {
            // If the profile doesn't exist, create a new one
            res.status(400).json({ error: 'Profile not exists' });
            return;
        }
  
        // Update the profile if it exists or create a new one if it doesn't
        await setDoc(profileDocRef, profileData, { merge: true });
  
        res.status(200).json({ message: 'Profile upserted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upsert profile' });
      }
    });
  }


export function init(app, db) {
  getUserProfile(app,db),
  upsertUserProfile(app,db),
  UpdateProfileEndgame(app,db)
}