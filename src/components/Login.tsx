import React, { useEffect } from "react";
import axios from "axios";
import "./Login.css";
import logo from "../assets/logo.png";
import fingerPrint from "../assets/fingerprint.png";
import lock from "../assets/padlock-unlock.png";
import user from "../assets/user.png";
import { IonButton, IonInput, IonItem, IonList } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { FingerprintAIO } from "@awesome-cordova-plugins/fingerprint-aio";

interface ContainerProps {}

const Login: React.FC<ContainerProps> = () => {
  const history = useHistory();
  const [numberDocument, setNumbereDocument] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState<any>(false);

  const authenticateWithFingerprint = () => {
    FingerprintAIO.show({
      title: "Ingresar con huella",
    }).then(() => {
      submit();
    });
  };

  const submit = () => {
    axios
      .post(
        `https://enlinea.coopcafam.coop/APIS/APPGERENCIAL/Login/ValidarUsuario?pIdentificacion=${numberDocument}&pClave=${password}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXRUJBUEktR0VSRU5DSUFMIiwiaWF0IjoxNjk2MDQ4OTU4LCJleHAiOjE3Mjc1ODQ5NTgsImF1ZCI6IldFQiBBUEktR0VSRU5DSUFMIiwic3ViIjoiaW5mb0BleHBpbm4uY29tLmNvIiwiS2V5IjoiM1hQMU5OX1QzQ0hOMEwwNlkiLCJVc2VyIjoiQVBQR0VSRU5DSUFMIiwiUGFzc3dvcmQiOiJwV1dpQVFvdDVWRFpSMVY2UExYR0xBPT0iLCJJZGVudGlmaWNhY2lvbiI6IkVYUElOTkFETSIsIkNsYXZlIjoiMTIzNDU2In0.O5ZjT_0eS-LEWlLQClQgoLLLFnOCp9e22j9hbCiMz94`}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 204) {
          alert("Credenciales incorrectas");
        } else if (res.status === 200) {
          localStorage.setItem("name", res.data.nombre);
          history.push("/dashboard");
        }
      })
      .catch((err) => alert("Something is wrong"));

    if (rememberMe) {
      localStorage.setItem("numberDocument", numberDocument);
      localStorage.setItem("password", password);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.setItem("numberDocument", "");
      localStorage.setItem("password", "");
      localStorage.setItem("rememberMe", "false");
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("numberDocument");
    const storedPassword = localStorage.getItem("password");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedUsername && storedPassword && storedRememberMe) {
      setNumbereDocument(storedUsername);
      setPassword(storedPassword);
      setRememberMe(storedRememberMe);
    }
  }, []);

  return (
    <div className="container">
      <div className="logo-title">
        <div>
          <img src={logo} alt="" />
        </div>
        <h1 style={{ textAlign: "center" }}>
          Gerencia en
          <br />
          sus manos
        </h1>
      </div>
      <div className="login-form">
        <IonList className="ligth">
          <IonItem className="ligth">
            <IonInput
              value={numberDocument}
              className="ligth"
              placeholder="Número de documento"
              onIonInput={(e: any) => setNumbereDocument(e.detail.value)}
            ></IonInput>
            <img style={{ width: "16px", height: "16px" }} src={user} />
          </IonItem>
          <IonItem className="ligth">
            <IonInput
              value={password}
              type="password"
              onIonInput={(e: any) => setPassword(e.detail.value)}
              className="ligth"
              placeholder="Contraseña"
            ></IonInput>
            <img style={{ width: "16px", height: "16px" }} src={lock} />
          </IonItem>
        </IonList>
        <div className="remember-me-container">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <input
              checked={rememberMe}
              type="checkbox"
              onChange={() => setRememberMe(!rememberMe)}
            />
            <span style={{ marginLeft: "10px", color: "#000" }}>
              Recordar mis datos
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IonButton
              onClick={submit}
              className="button-login"
              style={{ width: "60%" }}
            >
              Ingresar
            </IonButton>
          </div>
          <div
            onClick={authenticateWithFingerprint}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              style={{ width: "16px", height: "16px", marginRight: "6px" }}
              src={fingerPrint}
            />
            <p style={{ margin: 0, color: "#49B9E9" }}>Ingresar con huella</p>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

export default Login;
