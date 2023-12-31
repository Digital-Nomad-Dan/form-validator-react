//import { useState } from "react";
import "./style.css";
import { useImmer } from "use-immer";
import * as EmailValidator from "email-validator";
import { passwordStrength } from "check-password-strength";

const initialState = {
  email: "",
  password: "",
  confrimPassword: "",
  showPassword: false,
  showInvalidEmail: false,
  isPasswordShort: false,
  passwordMatch: false,
  passwordStrength: {
    color: "",
    value: "",
  },
};

function App() {
  const [state, setState] = useImmer(initialState);

  const validate =
    state.email &&
    !state.showInvalidEmail &&
    state.password.length > 8 &&
    ["Strong", "Medium"].includes(state.passwordStrength.value) &&
    state.password === state.confrimPassword;

  return (
    <div id="app">
      <form id="my-form" className="shadow">
        <h4>Form Validator</h4>

        <div className="mb-4">
          <label>Email</label>
          <input
            className="form-control"
            type="text"
            data-rules="required|digits:5|min:5"
            placeholder="Please put a valid email address"
            value={state?.email || ""}
            onChange={(event) => {
              setState((draft) => {
                draft.email = event.target.value;
              });
            }}
            onBlur={() => {
              setState((draft) => {
                draft.showInvalidEmail = !EmailValidator.validate(state?.email);
              });
            }}
          />
          {state.showInvalidEmail && (
            <p className="validator-err">Please use a real email</p>
          )}
        </div>
        <div
          className="mb-4"
          style={{
            position: "relative",
          }}
        >
          <label>Password</label>
          <input
            className="form-control"
            type={state.showPassword ? "text" : "password"}
            //type="text
            data-rules="required|string|min:5"
            value={state.password || ""}
            onChange={(event) => {
              setState((draft) => {
                draft.password = event.target.value;
                if (state.showPassword) {
                  draft.confrimPassword = event.target.value;
                }
                if (event.target.value.length > 8) {
                  const passwordStrengthValue = passwordStrength(
                    event.target.value
                  ).value;
                  draft.passwordStrength.value = passwordStrengthValue;
                  switch (passwordStrengthValue) {
                    case "Too weak":
                      draft.passwordStrength.color = "red";
                      break;
                    case "Weak":
                      draft.passwordStrength.color = "orange";
                      break;
                    case "Medium":
                      draft.passwordStrength.color = "Blue";
                      break;
                    default:
                      draft.passwordStrength.color = "green";
                  }

                  draft.isPasswordShort = false;
                } else {
                  draft.passwordStrength.value = "";
                  draft.passwordStrength.color = "";
                }
              });
            }}
            onBlur={() => {
              setState((draft) => {
                draft.isPasswordShort = state.password.length < 8;
              });
            }}
          />
          {state.isPasswordShort && (
            <p className="validator-err">
              Password must be more than 8 characters
            </p>
          )}
          <button
            style={{
              position: "absolute",
              top: 25,
              right: 10,
              width: 50,
              padding: "0px !important",
              margin: 0,
              fontSize: 2,
              border: "none !important",
            }}
            type="button"
            onClick={() => {
              setState((draft) => {
                draft.showPassword = !state.showPassword;
                if (state.showPassword) {
                  draft.confrimPassword = state.password;
                  draft.passwordMatch = true;
                } else {
                  draft.passwordMatch = false;
                  draft.confrimPassword = "";
                }
              });
            }}
          >
            eye
          </button>
        </div>
        {!state.showPassword && (
          <div className="mb-4">
            <label>Password Confirm</label>
            <input
              className="form-control"
              type="text"
              data-rules="required|digits:5|min:5"
              value={state.confrimPassword}
              onChange={(event) => {
                setState((draft) => {
                  draft.confrimPassword = event.target.value;
                  draft.passwordMatch = event.target.value == state.password;
                });
              }}
            />
          </div>
        )}
        {!state.passwordMatch && (
          <p className="validator-err">
            Confirm Password is not a match with original password
          </p>
        )}
        {}

        {state.passwordStrength.value && (
          <div
            className="mb-4"
            style={{
              position: "relative",
              color: state.passwordStrength.color,
            }}
          >
            {state.passwordStrength.value}
          </div>
        )}

        <ul className="information">
          <li>password must be at least 8 characters</li>
          <li>password must be at least 1 number</li>
          <li>password must be at least 1 Capital letter</li>
          <li>password must be at least 1 number</li>
          <li>password must be at least 1 symbol</li>
        </ul>
        <button
          disabled={!validate}
          style={{
            backgroundColor: validate ? "" : "gray",
          }}
          onClick={() => {
            alert(
              "Hoorah your form is validated and we are creating a user for you on our end"
            );
            setState(initialState);
          }}
          type="button"
        >
          Create Email
        </button>
      </form>
    </div>
  );
}

export default App;
