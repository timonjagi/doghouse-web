import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const logPetAdded = functions.firestore.document("pets/{docId}").onCreate(async (snapshot, context) => {
  const pet = snapshot.data(); // Assuming pet data is in event.data()

  // Retrieve current user from Firebase Auth
  const user = await admin.auth().getUser(pet.ownerId || pet.seekerId);

  if (pet.ownerId) {
    // Pet has ownerId, add activity log notifying users of pet addition with pet breed details
    const activity = {
      title: 'Pet added',
      description: `Hi, my ${pet.sex} ${pet.breed} ${pet.age} is available for adoption`,
      ownerId: pet.ownerId,
      userName: user.displayName,
      userProfilePhotoUrl: user.photoURL || null,
      userLocation: '',
      petBreed: pet.breed,
      petAge: pet.age,
      petSex: pet.sex,
      petImages: pet.images || null,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt
    };
    db.collection('activity').doc().set(activity);
  } else if (pet.seekerId) {
    // Pet has seekerId, add activity log notifying users of pet listing
    const activity = {
      title: 'Pet listed',
      description: `Hi, I'm looking for ${pet.sex} ${pet.breed} ${pet.age}`,
      seekerId: pet.seekerId,
      userName: user.displayName,
      userProfilePhotoUrl: user.photoURL || null,
      petBreed: pet.breed,
      petAge: pet.age,
      petSex: pet.sex,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt
    };
    db.collection('activity').doc().set(activity);
  }
});
