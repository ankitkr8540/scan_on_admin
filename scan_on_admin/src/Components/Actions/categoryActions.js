import { firestore } from "../../firebase";

export const loadCategories = () => {
  return (dispatch, getState) => {
    firestore
      .collection("CATAGORIES")
      .orderBy("index")
      .get()
      .then((querySnapshot) => {
        let catagories = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            catagories.push(doc.data());
          });
          dispatch({ type: "LOAD_CATEGORIES", payload: catagories });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
