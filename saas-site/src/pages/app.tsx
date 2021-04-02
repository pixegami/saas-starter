import React from "react";
import { Router } from "@reach/router";
import Layout from "../components/Layout";
import Dashboard from "../app/dashboard";
import Landing from "../app/landing";
import NotFound from "../app/notFound";
import AuthRoute from "../app/util/AuthRoute";
import AuthSignIn from "../components/auth/AuthSignIn";
import AuthRegister from "../components/auth/AuthRegister";
import ApiComponentWrapper from "../components/auth/ApiComponentWrapper";
import { WrappedApiSubComponent } from "../components/auth/ApiSubComponent";

const App = () => (
  <Layout>
    This is the app master page.
    <Router>
      <Landing path="/app" />

      <WrappedApiSubComponent path="/app/sc" />
      <AuthSignIn path="/app/signIn" />
      <AuthRegister path="/app/register" />

      <AuthRoute component={Dashboard} path="/app/dashboard" />

      <NotFound default />
    </Router>
  </Layout>
);
export default App;
