import { firestore } from "../../firebase";

export const loadCategories = (onSuccess, onError) => {
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
          onSuccess();
        }
      })
      .catch((error) => {
        console.log(error);
        onError();
      });
  };
};
export const addCategory = (data, onSuccess, onError) => {
  return (dispatch, getState) => {
    firestore
      .collection("CATAGORIES")
      .doc(data.categoryName.toUpperCase())
      .set(data)
      .then(function (doc) {
        dispatch({ type: "ADD_CATEGORY", payload: data });
        onSuccess();
      })
      .catch((error) => {
        console.log(error);
        onError();
        //error
      });
  };
};
