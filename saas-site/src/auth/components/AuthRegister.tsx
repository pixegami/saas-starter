import { Link } from "gatsby";
import * as React from "react";
import Auth from "../api/Auth";
import AuthApi from "../api/AuthApi";
import AuthResponse from "../api/AuthResponse";

interface AuthRegisterProps {
  path: string;
}

const AuthRegister: React.FC<AuthRegisterProps> = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isBusy, setIsBusy] = React.useState(false);

  const onRegisterSuccess = (response: AuthResponse) => {
    setIsBusy(false);
    console.log("Register success!");
    console.log("Token: ", response.token);
  };

  const onRegisterError = (x: any) => {
    setIsBusy(false);
    console.log("Failed to register");
    console.log(x);
  };

  const onRegister = () => {
    console.log("Register with ", email, password);
    setIsBusy(true);
    AuthApi.register(email, password)
      .then(onRegisterSuccess)
      .catch(onRegisterError);
  };

  const busyElement = isBusy ? <div>Loading...</div> : null;

  return (
    <div className="text-lg">
      <h1>This is the Auth Register Page.</h1>

      <input
        className="border m-1 p-1 border-black"
        type="text"
        defaultValue={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <input
        className="border m-1 p-1 border-black"
        type="password"
        defaultValue={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <button
        className="border m-1 p-1 border-black"
        type="button"
        onClick={onRegister}
        disabled={isBusy}
      >
        Register
      </button>

      {busyElement}

      <Link to="/app/landing">Back</Link>
    </div>
  );
};

export default AuthRegister;
