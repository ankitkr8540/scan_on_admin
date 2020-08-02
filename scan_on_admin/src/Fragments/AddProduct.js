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
} from "@material-ui/core";
import { Delete, FormatColorFill } from "@material-ui/icons";
import MaterialTable from "material-table";
import { tableIcons } from "../Fragments/ManageCategoryFragment";

class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
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

  render() {
    return (
      <Box bgcolor="#fff" boxShadow={1} p={4}>
        <Box display="flex" flexWrap="true">
          <Typography variant="h5" gutterBottom>
            New Product
          </Typography>
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
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          margin="normal"
          label="Price"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <TextField
          margin="normal"
          style={{ marginLeft: "16px" }}
          label="Cutted Price"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          margin="normal"
          label="Free coupons"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <FormControlLabel
          control={<Switch name="checkedB" color="primary" />}
          label="Attach Coupon"
        />
        <Box border={1} p={3} borderRadius={8}>
          <RadioGroup aria-label="gender" name="gender1" value="female">
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Discount"
            />
            <FormControlLabel
              value="male"
              control={<Radio />}
              label="Flat Rs.*OFF"
            />
          </RadioGroup>
          <TextField
            margin="normal"
            label="Coupon title"
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          <TextField
            label="Valid for Days"
            style={{ marginLeft: "16px" }}
            margin="normal"
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          <br />
          <TextField
            id="outlined-multiline-static"
            margin="normal"
            label="Coupon body"
            multiline
            fullWidth
            rows={4}
            defaultValue="Default Value"
            variant="outlined"
          />
          <br />
          <TextField
            margin="normal"
            label="Lower Limit"
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          <TextField
            margin="normal"
            style={{ marginLeft: "16px" }}
            label="Upper Limit"
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
          <TextField
            margin="normal"
            style={{ marginLeft: "16px" }}
            label="Percentage"
            id="outlined-size-small"
            variant="outlined"
            size="small"
          />
        </Box>
        <br />
        <TextField
          label="Max-Quantity"
          margin="normal"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <TextField
          label="Offers applied"
          style={{ marginLeft: "16px" }}
          margin="normal"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          id="outlined-multiline-static"
          fullWidth
          label="Description"
          margin="normal"
          multiline
          rows={4}
          defaultValue="Default Value"
          variant="outlined"
        />
        <br />
        <FormControlLabel
          control={<Switch name="checkedB" color="primary" />}
          label="Use Tab layout"
        />
        <MaterialTable
          icons={tableIcons}
          title="Specifications"
          options={{ search: false, paging: false }}
          columns={this.state.columns}
          data={this.state.data}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.push(newData);
                    return { ...prevState, data };
                  });
                }, 600);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  if (oldData) {
                    this.setState((prevState) => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      return { ...prevState, data };
                    });
                  }
                }, 600);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }, 600);
              }),
          }}
        />
        <br />
        <TextField
          id="outlined-multiline-static"
          label="Other Details"
          margin="normal"
          fullWidth
          multiline
          rows={4}
          defaultValue="Default Value"
          variant="outlined"
        />
        <br />
        <TextField
          label="Stock Quantity"
          id="outlined-size-small"
          variant="outlined"
          margin="normal"
          size="small"
        />
        <br />
        <FormControlLabel
          control={<Switch name="checkedB" color="primary" />}
          label="COD"
        />
        <br />
        <TextField
          label="Tags"
          margin="normal"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
      </Box>
    );
  }
}

export default AddProduct;
