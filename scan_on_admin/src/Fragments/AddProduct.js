import React, { Component } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { Delete, FormatColorFill } from "@material-ui/icons";

class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
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
          label="Product Title"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          label="Price"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <TextField
          label="Cutted Price"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          label="Free coupons"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <TextField
          label="Coupon title"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <TextField
          id="outlined-multiline-static"
          label="Coupon body"
          multiline
          rows={4}
          defaultValue="Default Value"
          variant="outlined"
        />
        <br />
        <TextField
          label="Max-Quantity"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <TextField
          label="Offers applied"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
        <br />
        <TextField
          id="outlined-multiline-static"
          label="Description"
          multiline
          rows={4}
          defaultValue="Default Value"
          variant="outlined"
        />
        <TextField
          id="outlined-multiline-static"
          label="Other Details"
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
          size="small"
        />
        <br />
        <FormControlLabel
          control={<Switch name="checkedB" color="primary" />}
          label="COD"
        />
        <FormControlLabel
          control={<Switch name="checkedB" color="primary" />}
          label="Use Tab layout"
        />
        <br />
        <TextField
          label="Tags"
          id="outlined-size-small"
          variant="outlined"
          size="small"
        />
      </Box>
    );
  }
}

export default AddProduct;
