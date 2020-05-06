import { firestore } from "../../firebase";

export const loadCategories = () => {
  return (dispatch, getState) => {
    firestore
      .collection("CATAGORIES")
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
