import React, { Component, forwardRef } from "react";
import { Container, Button, TextField } from "@material-ui/core";
import MaterialTable from "material-table";
import {
  AddBox,
  Check,
  Clear,
  DeleteOutline,
  ChevronRight,
  Edit,
  SaveAlt,
  FilterList,
  FirstPage,
  LastPage,
  ChevronLeft,
  Search,
  ArrowDownward,
  Remove,
  ViewColumn,
  Home,
} from "@material-ui/icons";
import { connect } from "react-redux";
import { firestore, storageRef } from "../firebase";
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "../Components/Actions/categoryActions";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

class ManageCategoryFragment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { title: "Index", field: "index", type: "numeric" },
        {
          title: "Category",
          field: "categoryName",
          editable: "onAdd",
        },
        {
          title: "Icon",
          field: "Icon",
          editComponent: (props) =>
            props.value === "null" ? (
              <Home />
            ) : (
              <>
                <input
                  accept="image/*"
                  id="contained-button-file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      this.setState({
                        image: e.target.files[0],
                      });
                      props.onChange(e.target.value);
                      e.target.value = null;
                    }
                  }}
                  hidden
                  name="image"
                  type="file"
                />
                <label htmlFor="contained-button-file">
                  {this.state.image || props.value ? (
                    <img
                      src={
                        this.state.image
                          ? this.renderImageUrl(this.state.image)
                          : props.value
                      }
                      style={{ width: 40, height: 40 }}
                    />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      Add Image
                    </Button>
                  )}
                </label>
              </>
            ),
          render: (rowData) =>
            rowData.Icon === "null" ? (
              <Home />
            ) : (
              <img src={rowData.Icon} style={{ width: 40, height: 40 }} />
            ),
        },
      ],
    };
  }

  renderImageUrl = (item) => {
    try {
      return URL.createObjectURL(item);
    } catch (error) {
      return item;
    }
  };

  uploadImage = (onCompleted) => {
    let file = this.state.image;
    try {
      if (file.startsWith("https")) {
        onCompleted(file);
      }
    } catch (error) {
      var ts = String(new Date().getTime()),
        i = 0;
      this.state.out = "";
      for (i = 0; i < ts.length; i += 2) {
        this.state.out += Number(ts.substr(i, 2)).toString(36);
      }

      let filename = "category" + this.state.out;

      var uploadTask = storageRef
        .child("categories/" + filename + ".jpg")
        .put(file); // change the name of bannerads to banners

      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        function (error) {
          //handle unsuccesfull uploads
        },
        function () {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
            onCompleted(downloadUrl);
          });
        }
      );
    }
  };

  deleteImage = (image, onComplete) => {
    let splited_link = image.split("/");
    let name = splited_link[splited_link.length - 1]
      .split("?")[0]
      .replace("bannerads%2F", ""); //banners can be added when change in storage folder from bannerads

    storageRef
      .child("categories/" + name)
      .delete()
      .then(() => {
        onComplete(true);
      })
      .catch((err) => {
        onComplete(false);
      });
  };
  render() {
    return (
      <div>
        <Container maxWidth="md" fixed>
          <MaterialTable
            icons={tableIcons}
            title="Editable Example"
            columns={this.state.columns}
            data={this.props.catagories}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  if (newData.index && newData.categoryName && newData.Icon) {
                    this.uploadImage((url) => {
                      newData["Icon"] = url;
                      this.props.addCategory(
                        newData,
                        () => resolve(),
                        (error) => resolve()
                      );
                    });
                  } else {
                    resolve();
                    this.setState({
                      image: null,
                    });
                  }
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  if (
                    newData.index === oldData.index &&
                    newData.Icon === oldData.Icon
                  ) {
                    resolve();
                    this.setState({
                      image: null,
                    });
                  } else if (newData.Icon === oldData.Icon) {
                    this.props.updateCategory(
                      newData,
                      () => resolve(),
                      (error) => resolve()
                    );
                  } else {
                    this.deleteImage(oldData.Icon, (success) => {
                      if (success) {
                        this.uploadImage((url) => {
                          newData["Icon"] = url;
                          this.props.update(
                            newData,
                            () => resolve(),
                            (error) => resolve()
                          );
                        });
                      } else {
                        resolve();
                      }
                    });
                  }
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  this.props.deleteCategory(
                    oldData.categoryName,
                    () => resolve(),
                    (error) => resolve()
                  );
                }),
            }}
          />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    catagories: state.catagories,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addCategory: (data, onSuccess, onError) =>
      dispatch(addCategory(data, onSuccess, onError)),
    deleteCategory: (name, onSuccess, onError) =>
      dispatch(deleteCategory(name, onSuccess, onError)),
    updateCategory: (data, onSuccess, onError) =>
      dispatch(updateCategory(data, onSuccess, onError)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCategoryFragment);
