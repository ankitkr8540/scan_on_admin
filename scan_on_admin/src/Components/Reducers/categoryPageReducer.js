const initState = {};

const categoryPageReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_PAGE":
      state = { ...state, [action.catagory]: action.payload };
      break;
    default:
      break;
  }
  return state;
};

export default categoryPageReducer;
