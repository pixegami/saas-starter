import "./src/styles/global.css";
import "./src/styles/loader.css";
import "./src/styles/typography.css";
import React from "react";
import Layout from "./src/layout/Layout";

export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return <Layout {...props}>{element}</Layout>;
};
