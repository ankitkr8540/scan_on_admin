import React, { Component } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Container, Avatar } from "@material-ui/core";
import BannerSlider from "../Components/BannerSlider";
import ProductView from "../Components/ProductView";
import HorizontalScroller from "../Components/HorizontalScroller";
import StripAdView from "../Components/StripAdView";
import { GridView } from "../Components/GridView";
import { loadCategories } from "../Components/Actions/categoryActions";
import { connect } from "react-redux";
import { Home } from "@material-ui/icons";

export class HomeFragment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };
  }
  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    });
  };

  componentDidMount() {
    if (this.props.catagories === null) {
      this.props.loadCategories();
    }
  }
  render() {
    return (
      <Container maxWidth="md" fixed>
        <AppBar position="static" color="white">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {this.props.catagories
              ? this.props.catagories.map((catagory) => (
                  <Tab
                    icon={
                      <CategoryTab
                        icon={catagory.Icon}
                        title={catagory.categoryName}
                      />
                    }
                  />
                ))
              : null}
          </Tabs>
        </AppBar>
        <BannerSlider Images={[{ image: "sdfsef" }]} />
        <HorizontalScroller />
        <StripAdView />
        <GridView />
      </Container>
    );
  }
}

export const CategoryTab = ({ icon, title }) => {
  return (
    <Box textAlign="center">
      {icon !== "null" ? (
        <img src={icon} style={{ height: "30px", width: "30px" }} />
      ) : (
        <Home />
      )}
      <Typography variant="body2" textAlign="center">
        {title}
      </Typography>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    catagories: state.catagories,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loadCategories: () => dispatch(loadCategories()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFragment);
