import { firestore } from "../../firebase";

export const loadCategoryPage = (catagory, onSuccess, onError) => {
  return (dispatch, getState) => {
    firestore
      .collection("CATAGORIES")
      .doc(catagory)
      .collection("TOP_DEALS")
      .orderBy("index")
      .get()
      .then((querySnapshot) => {
        let pagedata = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            pagedata.push(doc.data());
          });
          dispatch({ type: "LOAD_PAGE", payload: pagedata, catagory });
          onSuccess();
        }
      })
      .catch((error) => {
        console.log(error);
        onError();
      });
  };
};
