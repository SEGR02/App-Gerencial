import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import user from "../assets/user-profile.png";
import documents from "../assets/document.png";
import bars from "../assets/bar-chart.png";
import { Link, useHistory } from "react-router-dom";
import { IonButton } from "@ionic/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend);

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: true,
      },
      ticks: {
        display: true,
        font: {
          size: 10,
        },
      },
    },
  },
};

interface ContainerProps {}

const Dashboard: React.FC<ContainerProps> = () => {
  const username = localStorage.getItem("name");
  const history = useHistory();
  const [cardsData, setCardsData] = useState<any>({});
  const [graphicData, setGraphicData] = useState<any>([]);
  const [showLogOut, setShowLogOut] = useState<any>(false);

  const getGraphicData = () => {
    const result: any = [];
    const labels: any = [];
    graphicData.forEach((bar: any) => {
      result.push(bar.TotalCartera);
      labels.push(bar.categoria);
    });
    return { result, labels };
  };

  const data = {
    labels: getGraphicData().labels,
    datasets: [
      {
        data: getGraphicData().result,
        backgroundColor: [
          "rgba(170, 170, 170, 0.95)",
          "rgba(119, 119, 119, 0.95)",
          "rgba(51, 51, 51, 0.95)",
          "rgba(204, 204, 204, 0.95)",
          "rgba(255, 255, 255, 0.95)",
        ],
      },
    ],
  };

  useEffect(() => {
    axios
      .post(
        `https://enlinea.coopcafam.coop/APIS/APPGERENCIAL/Indicadores/IndicadorCarteraAlaFecha?pRedondeo=1000000`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXRUJBUEktR0VSRU5DSUFMIiwiaWF0IjoxNjk2MDQ4OTU4LCJleHAiOjE3Mjc1ODQ5NTgsImF1ZCI6IldFQiBBUEktR0VSRU5DSUFMIiwic3ViIjoiaW5mb0BleHBpbm4uY29tLmNvIiwiS2V5IjoiM1hQMU5OX1QzQ0hOMEwwNlkiLCJVc2VyIjoiQVBQR0VSRU5DSUFMIiwiUGFzc3dvcmQiOiJwV1dpQVFvdDVWRFpSMVY2UExYR0xBPT0iLCJJZGVudGlmaWNhY2lvbiI6IkVYUElOTkFETSIsIkNsYXZlIjoiMTIzNDU2In0.O5ZjT_0eS-LEWlLQClQgoLLLFnOCp9e22j9hbCiMz94`}`,
          },
        }
      )
      .then((res) => setCardsData(res.data))
      .catch((err) => alert("Something is wrong"));

    axios
      .post(
        `https://enlinea.coopcafam.coop/APIS/APPGERENCIAL/Indicadores/IndicadorCarteraAlaFechaPorCategoria?pRedondeo=1000000`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXRUJBUEktR0VSRU5DSUFMIiwiaWF0IjoxNjk2MDQ4OTU4LCJleHAiOjE3Mjc1ODQ5NTgsImF1ZCI6IldFQiBBUEktR0VSRU5DSUFMIiwic3ViIjoiaW5mb0BleHBpbm4uY29tLmNvIiwiS2V5IjoiM1hQMU5OX1QzQ0hOMEwwNlkiLCJVc2VyIjoiQVBQR0VSRU5DSUFMIiwiUGFzc3dvcmQiOiJwV1dpQVFvdDVWRFpSMVY2UExYR0xBPT0iLCJJZGVudGlmaWNhY2lvbiI6IkVYUElOTkFETSIsIkNsYXZlIjoiMTIzNDU2In0.O5ZjT_0eS-LEWlLQClQgoLLLFnOCp9e22j9hbCiMz94`}`,
          },
        }
      )
      .then((res) => setGraphicData(res.data))
      .catch((err) => alert("Something is wrong"));

    localStorage.setItem("name", CapitalizeString(username));
  }, []);

  const getPercentage = () => {
    let aux =
      (cardsData.TotalCartera - cardsData.TotalCarteraAlDia) /
      cardsData.TotalCartera;
    aux = aux * 100 - 100;
    aux = Math.abs(aux);
    return Number(aux.toFixed(2));
  };

  const CapitalizeString = (inputString: any) => {
    const lowercaseString = inputString.toLowerCase();
    const words = lowercaseString.split(" ");
    const capitalizedWords = words.map((word: any) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    const capitalizedString = capitalizedWords.join(" ");
    return capitalizedString;
  };

  return (
    <div className="main-container">
      <div className="header">
        <div className="header-name">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ marginBottom: 0 }}>
              <b>Hola, {CapitalizeString(username)}</b>
            </p>
            <img
              onClick={() => setShowLogOut(!showLogOut)}
              style={{ width: "22px", height: "22px" }}
              src={user}
              alt=""
            />
            <div
              onClick={() => history.push("/home")}
              style={showLogOut ? { display: "block" } : { display: "none" }}
            >
              Cerrar Sesion
            </div>
          </div>
          <div className="header-company">
            <p style={{ margin: 0, fontSize: "0.8em" }}>
              <b>A continuación la información de COOPCAFAM</b>
            </p>
          </div>
        </div>
      </div>
      <div className="title-cards">
        <p className="title">
          <b>CARTERA</b>
        </p>
        <div className="cards-container">
          <div style={{ backgroundColor: "#0099CC" }} className="card">
            <p style={{ margin: 0 }}>TOTAL</p>
            <p style={{ margin: 0 }}>
              <b>
                {Object.keys(cardsData).length > 0
                  ? cardsData.TotalCartera?.toLocaleString() + "MM"
                  : "Cargando"}
              </b>
            </p>
          </div>
          <div style={{ backgroundColor: "#76A5AF" }} className="card">
            <p style={{ margin: 0 }}>AL DIA</p>
            <p style={{ margin: 0 }}>
              <b>
                {Object.keys(cardsData).length > 0
                  ? cardsData.TotalCarteraAlDia?.toLocaleString() + "MM"
                  : "Cargando"}
              </b>
            </p>
            <p style={{ margin: 0 }}>
              {Object.keys(cardsData).length > 0
                ? "≈ " + getPercentage() + "%"
                : "Cargando"}
            </p>
          </div>
          <div style={{ backgroundColor: "#B4A7D6" }} className="card">
            <p style={{ margin: 0 }}>VENCIDA</p>
            <p style={{ margin: 0 }}>
              <b>
                {Object.keys(cardsData).length > 0
                  ? cardsData.TotalCarteraVencida?.toLocaleString() + "MM"
                  : "Cargando"}
              </b>
            </p>
            <p style={{ margin: 0 }}>
              {Object.keys(cardsData).length > 0
                ? "≈ " + String((100 - getPercentage()).toFixed(2)) + "%"
                : "Cargando"}
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#EEEEEE",
          paddingTop: "10px",
          marginRight: "30px",
          marginLeft: "30px",
          boxShadow: "0px 0px 2px 1px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Bar data={data} options={options} />
      </div>
      <div className="buttons">
        <IonButton className="button-sections">
          <Link
            style={{
              display: "flex",
              color: "#0752CF",
              textDecoration: "none",
              alignItems: "center",
            }}
            to="/financialStatements"
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#E7E7E7",
                borderRadius: "50%",
                marginRight: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px solid #c1c1c1",
              }}
            >
              <img
                style={{ width: "40px", height: "40px" }}
                src={documents}
                alt=""
              />
            </div>
            Estados <br /> Financieros
          </Link>
        </IonButton>
        <IonButton className="button-sections">
          <Link
            style={{
              display: "flex",
              color: "#0752CF",
              textDecoration: "none",
              alignItems: "center",
            }}
            to="/indicators"
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#E7E7E7",
                borderRadius: "50%",
                marginRight: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px solid #c1c1c1",
              }}
            >
              <img
                style={{ width: "40px", height: "40px", marginBottom: 10 }}
                src={bars}
                alt=""
              />
            </div>
            Indicadores
          </Link>
        </IonButton>
      </div>
    </div>
  );
};

export default Dashboard;
