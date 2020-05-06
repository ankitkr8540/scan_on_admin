import { firestore } from "../../firebase";
import { Category } from "@material-ui/icons";

export const loadCategories = () => {
  return (dispatch, getState) => {
    firestore
      .collection("CATAGORIES")
      .orderBy("index")
      .get()
      .then((querySnapshot) => {
        let categories = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            categories.push(doc.data());
          });
          dispatch({ type: "LOAD_CATEGORIES", payload: categories });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
