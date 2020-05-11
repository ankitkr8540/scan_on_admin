import React, { Component } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  Container,
  Avatar,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import BannerSlider from "../Components/BannerSlider";
import ProductView from "../Components/ProductView";
import HorizontalScroller from "../Components/HorizontalScroller";
import StripAdView from "../Components/StripAdView";
import { GridView } from "../Components/GridView";
import { loadCategories } from "../Components/Actions/categoryActions";
import { connect } from "react-redux";
import { Home } from "@material-ui/icons";
import { loadCategoryPage } from "../Components/Actions/categoryPageAction";

export class HomeFragment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      value: 0,
      Page: "HOME",
    };
  }
  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    });
  };

  componentDidMount() {
    if (this.props.catagories === null) {
      this.props.loadCategories(
        () => {
          this.props.loadPage(
            "HOME",
            () => {
              this.setState({ loading: false });
            },
            () => {
              this.setState({ loading: false });
              //error
            }
          );
        },
        () => {
          this.setState({ loading: false });

          //error
        }
      );
    }
  }
  render() {
    return (
      <div>
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

          {this.props.categoryPages
            ? this.props.categoryPages[this.state.Page].map((item, index) => {
                switch (item.view_type) {
                  case 0:
                    let banners = [];
                    for (
                      let index = 1;
                      index < item.no_of_banners + 1;
                      index++
                    ) {
                      const banner = item["banner_" + index];
                      const background =
                        item["banner_" + index + "_background"];

                      banners.push({ banner, background });
                    }
                    return <BannerSlider Images={banners} />;

                  default:
                    break;
                }
              })
            : null}

          <HorizontalScroller />
          <StripAdView />
          <GridView />
        </Container>
        <Backdrop style={{ zIndex: 1500 }} open={this.state.loading}>
          <CircularProgress color="primary" />
        </Backdrop>
      </div>
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
    categoryPages: state.categoryPages,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loadCategories: (onSuccess, onError) =>
      dispatch(loadCategories(onSuccess, onError)),
    loadPage: (category, onSuccess, onError) =>
      dispatch(loadCategoryPage(category, onSuccess, onError)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFragment);
