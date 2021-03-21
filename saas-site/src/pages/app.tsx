import React from "react";
import { Router } from "@reach/router";
import Layout from "../components/Layout";
import Dashboard from "../app/dashboard";
import Landing from "../app/landing";
import NotFound from "../app/notFound";
import AuthRoute from "../app/util/AuthRoute";
import AuthLanding from "../auth/components/AuthWidget";
import AuthRegister from "../auth/components/AuthRegister";
import AuthSignIn from "../auth/components/AuthSignIn";

const App = () => (
  <Layout>
    This is the app master page.
    <Router>
      <AuthRoute component={Dashboard} path="/app/dashboard" />
      <Landing path="/app/landing" />
      <AuthSignIn path="/app/signIn" />
      <AuthRegister path="/app/register" />
      <NotFound default />
    </Router>
  </Layout>
);
export default App;
