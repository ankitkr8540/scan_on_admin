import React, { Component } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  Typography,
  RadioGroup,
  Radio,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { Delete, FormatColorFill } from "@material-ui/icons";
import MaterialTable from "material-table";
import { tableIcons } from "../Fragments/ManageCategoryFragment";
import { firestore, storageRef } from "../firebase";

class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      images: [],
      COD: false,
      coupon_type: "percentage",
      product_title: { error: "", value: "" },
      price: { error: "", value: "" },
      cutted_price: { error: "", value: "0" },
      free_coupons: { error: "", value: "0" },
      coupon_title: { error: "", value: "" },
      validity_period: { error: "", value: "" },
      coupon_body: { error: "", value: "" },
      lower_limit: { error: "", value: "" },
      upper_limit: { error: "", value: "" },
      percentage: { error: "", value: "" },
      discount_amount: { error: "", value: "" },
      max_quantity: { error: "", value: "" },
      offers_applied: { error: "", value: "0" },
      description: { error: "", value: "" },
      other_details: { error: "", value: "" },
      stock_qantity: { error: "", value: "" },
      tags: { error: "", value: "" },

      columns: [
        { title: "Key", field: "field" },
        { title: "Value", field: "value" },
      ],
      data: [
        // { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 },
        // {
        //   name: "Zerya Betül",
        //   surname: "Baran",
        //   birthYear: 2017,
        //   birthCity: 34,
        // },
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

  removeImage = (index) => {
    let images = this.state.images;
    let image = images[index];
    images.splice(index, 1);

    try {
      if (image.startsWith("https")) {
        this.setState(
          { loading: true }
          //   this.deleteImages([image], 0, () => {
          //     this.setState({
          //       loading: false,
          //       images,
          //     });
          //   })
        );
      }
    } catch (error) {
      this.setState({
        images,
      });
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: { error: "", value: e.target.value },
    });
  };

  uploadImages = (images, index, urls, onCompleted) => {
    const uploadAgain = (images, index, urls, onCompleted) =>
      this.uploadImages(images, index, urls, onCompleted);
    let file = images[index];
    try {
      if (file.startsWith("https")) {
        urls.push(file);
        index++;
        if (index < images.length) {
          uploadAgain(images, index, urls, onCompleted);
        } else {
          onCompleted();
        }
      }
    } catch (error) {
      var ts = String(new Date().getTime()),
        i = 0;
      this.state.out = "";
      for (i = 0; i < ts.length; i += 2) {
        this.state.out += Number(ts.substr(i, 2)).toString(36);
      }

      let filename = "banner" + this.state.out;

      var uploadTask = storageRef
        .child("products/" + filename + ".jpg")
        .put(file); // change the name of bannerads to banners

      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        function (error) {},
        function () {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
            urls.push(downloadUrl);
            index++;
            if (index < images.length) {
              uploadAgain(images, index, urls, onCompleted);
            } else {
              onCompleted();
            }
          });
        }
      );
    }
  };

  uploadProduct = (e) => {
    if (this.state.images.length === 0) {
      return;
    }
    if (this.state.useTabLayout && this.state.data.length === 0) {
      return;
    }
    let mandatoryFields = [
      "product_title",
      "price",
      "max_quantity",
      "description",
      "other_details",
      "stock_qantity",
      "tags",
    ];
    if (this.state.attachCoupon) {
      let couponsFields = [
        "coupon_title",
        "validity_period",
        "coupon_body",
        "lower_limit",
        "upper_limit",
        "percentage",
        "discount_amount",
      ];
      mandatoryFields = [...mandatoryFields, ...couponsFields];
    }
    let uploadSignal = true;
    mandatoryFields.forEach((element) => {
      let field = this.state[element];
      if (field.value === "") {
        field.error = "Required!";
        uploadSignal = false;
      }
    });
    if (!uploadSignal) {
      this.setState({});
      return;
    }

    let index = 0;
    let urls = [];
    this.setState({
      loading: true,
    });

    this.uploadImages(this.state.images, index, urls, () => {
      let data = {
        no_of_product_images: urls.length,
        product_title: this.state.product_title.value,
        product_price: this.state.price.value,
        product_other_details: this.state.other_details.value,
        COD: this.state.COD,
        cutted_price: this.state.cutted_price.value,
        ["max-quantity"]: this.state.max_quantity.value,
      };
      if (this.state.attachCoupon) {
        data["free_coupen_body"] = this.state.coupon_body.value; /////////////////////////data['free_coupon_body'] = this.state.coupon_body.value
        data["free_coupen_title"] = this.state.coupon_title.value;
        data["free_coupens"] = this.state.free_coupons.value;
        data["free_coupen_body"] = this.state.free_coupon_body.value;
      }
      urls.forEach((url, index) => {
        data["product_image_" + (index + 1)] = url;
      });
    });
  };

  render() {
    console.log(this.state.data);
    return (
      <Box bgcolor="#fff" boxShadow={1} p={4}>
        <Typography variant="h5" gutterBottom>
          New Product
        </Typography>
        <Box display="flex" flexWrap="true">
          {this.state.images.map((item, index) => (
            <Box margin="12px">
              <img
                src={this.renderImageUrl(item)}
                style={{
                  height: "90px",
                  width: "160px",
                  objectFit: "scale-down",
                }}
              />
              <br />

              <IconButton
                aria-label="delete"
                onClick={(e) => this.removeImage(index)}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
        </Box>
        <input
          accept="image/*"
          id="contained-button-file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              let images = this.state.images;
              images.push(e.target.files[0]);
              this.setState({
                images,
              });
              e.target.value = null;
            }
          }}
          hidden
          name="images"
          type="file"
        />
        <br />
        {this.state.images.length < 8 ? (
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              Add Image
            </Button>
          </label>
        ) : null}
        <br />
        <TextField
          fullWidth
          margin="normal"
          label="Product Title"
          id="outlined-size-small"
          onChange={this.onChange}
          name="product_title"
          error={this.state.product_title.error !== ""}
          helperText={this.state.product_title.error}
          defaultValue={this.state.product_title.value}
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          margin="normal"
          label="Price"
          onChange={this.onChange}
          name="price"
          type="number"
          error={this.state.price.error !== ""}
          helperText={this.state.price.error}
          defaultValue={this.state.price.value}
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <TextField
          margin="normal"
          style={{ marginLeft: "16px" }}
          onChange={this.onChange}
          name="cutted_price"
          type="number"
          error={this.state.cutted_price.error !== ""}
          helperText={this.state.cutted_price.error}
          defaultValue={this.state.cutted_price.value}
          label="Cutted Price"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          margin="normal"
          onChange={this.onChange}
          name="free_coupons"
          type="number"
          error={this.state.free_coupons.error !== ""}
          helperText={this.state.free_coupons.error}
          defaultValue={this.state.free_coupons.value}
          label="Free coupons"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <FormControlLabel
          control={
            <Switch
              name="attach_coupon"
              color="primary"
              onChange={(e) =>
                this.setState({
                  attachCoupon: e.target.checked,
                })
              }
            />
          }
          label="Attach Coupon"
        />
        <Box
          border={1}
          p={3}
          borderRadius={8}
          hidden={!this.state.attachCoupon}
        >
          <RadioGroup
            aria-label="gender"
            name="coupon_type"
            onChange={(e) =>
              this.setState({
                coupon_type: e.target.value,
              })
            }
            defaultValue="percentage"
          >
            <FormControlLabel
              value="percentage"
              control={<Radio />}
              label="Discount"
            />
            <FormControlLabel
              value="flat_rs_off"
              control={<Radio />}
              label="Flat Rs.*OFF"
            />
          </RadioGroup>
          <TextField
            margin="normal"
            label="Coupon title"
            onChange={this.onChange}
            name="coupon_title"
            error={this.state.coupon_title.error !== ""}
            helperText={this.state.coupon_title.error}
            defaultValue={this.state.coupon_title.value}
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          <TextField
            label="Valid for Days"
            style={{ marginLeft: "16px" }}
            onChange={this.onChange}
            name="validity_period"
            type="number"
            margin="normal"
            error={this.state.validity_period.error !== ""}
            helperText={this.state.validity_period.error}
            defaultValue={this.state.validity_period.value}
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          <br />
          <TextField
            id="outlined-multiline-static"
            margin="normal"
            label="Coupon body"
            onChange={this.onChange}
            name="coupon_body"
            error={this.state.coupon_body.error !== ""}
            helperText={this.state.coupon_body.error}
            defaultValue={this.state.coupon_body.value}
            multiline
            fullWidth
            rows={4}
            variant="outlined"
          />
          <br />
          <TextField
            margin="normal"
            label="Lower Limit"
            onChange={this.onChange}
            name="lower_limit"
            type="number"
            error={this.state.lower_limit.error !== ""}
            helperText={this.state.lower_limit.error}
            defaultValue={this.state.lower_limit.value}
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          <TextField
            margin="normal"
            style={{ marginLeft: "16px" }}
            onChange={this.onChange}
            name="upper_limit"
            label="Upper Limit"
            type="number"
            error={this.state.upper_limit.error !== ""}
            helperText={this.state.upper_limit.error}
            defaultValue={this.state.upper_limit.value}
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          {this.state.coupon_type === "percentage" ? (
            <TextField
              margin="normal"
              style={{ marginLeft: "16px" }}
              label="Percentage"
              onChange={this.onChange}
              name="percentage"
              type="number"
              error={this.state.percentage.error !== ""}
              helperText={this.state.percentage.error}
              defaultValue={this.state.percentage.value}
              id="outlined-size-small"
              variant="outlined"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              style={{ marginLeft: "16px" }}
              label="Discount Amount"
              onChange={this.onChange}
              name="discount_amount"
              type="number"
              error={this.state.discount_amount.error !== ""}
              helperText={this.state.discount_amount.error}
              defaultValue={this.state.discount_amount.value}
              id="outlined-size-small"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
        <br />
        <TextField
          label="Max-Quantity"
          margin="normal"
          onChange={this.onChange}
          name="max_quantity"
          type="number"
          id="outlined-size-small"
          error={this.state.max_quantity.error !== ""}
          helperText={this.state.max_quantity.error}
          defaultValue={this.state.max_quantity.value}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Offers applied"
          style={{ marginLeft: "16px" }}
          margin="normal"
          onChange={this.onChange}
          name="offers_applied"
          type="number"
          error={this.state.offers_applied.error !== ""}
          helperText={this.state.offers_applied.error}
          defaultValue={this.state.offers_applied.value}
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          id="outlined-multiline-static"
          fullWidth
          label="Description"
          onChange={this.onChange}
          name="description"
          margin="normal"
          error={this.state.description.error !== ""}
          helperText={this.state.description.error}
          defaultValue={this.state.description.value}
          multiline
          rows={4}
          variant="outlined"
        />
        <br />
        <FormControlLabel
          control={
            <Switch
              name="use_tab_layout"
              color="primary"
              onChange={(e) =>
                this.setState({
                  useTabLayout: e.target.checked,
                })
              }
            />
          }
          label="Use Tab Layout"
        />
        {this.state.useTabLayout && (
          <MaterialTable
            icons={tableIcons}
            title="Specifications"
            options={{ search: false, paging: false }}
            columns={this.state.columns}
            data={this.state.data}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  resolve();
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.push(newData);
                    return { ...prevState, data };
                  });
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  resolve();
                  if (oldData) {
                    this.setState((prevState) => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      return { ...prevState, data };
                    });
                  }
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  resolve();
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }),
            }}
          />
        )}
        <br />
        <TextField
          id="outlined-multiline-static"
          label="Other Details"
          margin="normal"
          onChange={this.onChange}
          name="other_details"
          error={this.state.other_details.error !== ""}
          helperText={this.state.other_details.error}
          defaultValue={this.state.other_details.value}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
        />
        <br />
        <TextField
          label="Stock Quantity"
          id="outlined-size-small"
          variant="outlined"
          onChange={this.onChange}
          name="stock_quantity"
          type="number"
          error={this.state.stock_qantity.error !== ""}
          helperText={this.state.stock_qantity.error}
          defaultValue={this.state.stock_qantity.value}
          margin="normal"
          size="small"
        />
        <br />
        <FormControlLabel
          control={
            <Switch
              name="COD"
              color="primary"
              onChange={(e) =>
                this.setState({
                  COD: e.target.checked,
                })
              }
            />
          }
          label="COD"
        />
        <br />
        <TextField
          label="Tags"
          margin="normal"
          id="outlined-size-small"
          onChange={this.onChange}
          name="tags"
          fullWidth
          variant="outlined"
          size="small"
          error={this.state.tags.error !== ""}
          helperText={this.state.tags.error}
          defaultValue={this.state.tags.value}
        />
        <br />
        <Button
          variant="contained"
          fullWidth
          color="primary"
          component="span"
          onClick={this.uploadProduct}
        >
          Upload
        </Button>
        <Backdrop style={{ zIndex: 1500 }} open={this.state.loading}>
          <CircularProgress color="primary" />
        </Backdrop>
      </Box>
    );
  }
}

export default AddProduct;
