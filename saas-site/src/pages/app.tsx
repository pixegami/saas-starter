import React from "react";
import Landing from "../app/landing";
import AuthRoute from "../components/auth/route/AuthRoute";
import ProfileView from "../app/ProfileView";
import PageNotFound from "./404";
import AuthRouter from "../components/auth/route/AuthRouter";

const App = () => {
  return (
    <AuthRouter>
      <AuthRoute component={Landing} path="/app" bypassAuth />
      {/* <AuthRoute component={Dashboard} path="/app/dashboard" /> */}
      <AuthRoute component={ProfileView} path="/app/profile" />
      {/* <Dashboard path="/app/dashboard2" /> */}
      <PageNotFound default />
    </AuthRouter>
  );
};
export default App;
