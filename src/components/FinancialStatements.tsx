import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FinancialStatements.css";
import user from "../assets/user-profile.png";
import backArrow from "../assets/left-arrow.png";
import { IonItem, IonList, IonSelect, IonSelectOption } from "@ionic/react";
import { useHistory } from "react-router-dom";

interface ContainerProps {}

const FinancialStatements: React.FC<ContainerProps> = () => {
  interface EstadoFinanciero {
    nombre_cuenta: string;
    valor: number;
  }

  const history = useHistory();
  const [availableDates, setAvailableDates] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const username = localStorage.getItem("name");
  const [selectedDate, setSelectedDate] = useState("");
  const [commonReason, setCommonReason] = useState();
  const [pastDuePortfolio, setPastDuePortfolio] = useState();
  const [showLogOut, setShowLogOut] = useState<any>(false);

  useEffect(() => {
    axios
      .post(
        `https://enlinea.coopcafam.coop/APIS/APPGERENCIAL/EstadosFinancieros/ListasFechas?pTipo=C`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXRUJBUEktR0VSRU5DSUFMIiwiaWF0IjoxNjk2MDQ4OTU4LCJleHAiOjE3Mjc1ODQ5NTgsImF1ZCI6IldFQiBBUEktR0VSRU5DSUFMIiwic3ViIjoiaW5mb0BleHBpbm4uY29tLmNvIiwiS2V5IjoiM1hQMU5OX1QzQ0hOMEwwNlkiLCJVc2VyIjoiQVBQR0VSRU5DSUFMIiwiUGFzc3dvcmQiOiJwV1dpQVFvdDVWRFpSMVY2UExYR0xBPT0iLCJJZGVudGlmaWNhY2lvbiI6IkVYUElOTkFETSIsIkNsYXZlIjoiMTIzNDU2In0.O5ZjT_0eS-LEWlLQClQgoLLLFnOCp9e22j9hbCiMz94`,
          },
        }
      )
      .then((res) => {
        const [year, month, day] = res?.data?.[res.data.length - 1]?.fecha
          ?.slice(0, 10)
          ?.split("-");
        setSelectedDate(`${year}-${month}-${day}`);
        getUniqueDates(res.data);
      });
  }, []);

  useEffect(() => {
    axios
      .post(
        `https://enlinea.coopcafam.coop/APIS/APPGERENCIAL/EstadosFinancieros/ConsultarEstadoFinanciero?pFecha=${selectedDate}&pNivel=1&pRedondeo=1000000`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXRUJBUEktR0VSRU5DSUFMIiwiaWF0IjoxNjk2MDQ4OTU4LCJleHAiOjE3Mjc1ODQ5NTgsImF1ZCI6IldFQiBBUEktR0VSRU5DSUFMIiwic3ViIjoiaW5mb0BleHBpbm4uY29tLmNvIiwiS2V5IjoiM1hQMU5OX1QzQ0hOMEwwNlkiLCJVc2VyIjoiQVBQR0VSRU5DSUFMIiwiUGFzc3dvcmQiOiJwV1dpQVFvdDVWRFpSMVY2UExYR0xBPT0iLCJJZGVudGlmaWNhY2lvbiI6IkVYUElOTkFETSIsIkNsYXZlIjoiMTIzNDU2In0.O5ZjT_0eS-LEWlLQClQgoLLLFnOCp9e22j9hbCiMz94`}`,
          },
        }
      )
      .then((res) => {
        if (res.data.length > 0) setDataWithoutRepeatsAccounts(res.data);
        else alert("Selecciona el ultimo dia del mes");
      });

    axios
      .post(
        `https://enlinea.coopcafam.coop/APIS/APPGERENCIAL/EstadosFinancieros/ConsultarIndicadorFinanciero?pFecha=${selectedDate}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXRUJBUEktR0VSRU5DSUFMIiwiaWF0IjoxNjk2MDQ4OTU4LCJleHAiOjE3Mjc1ODQ5NTgsImF1ZCI6IldFQiBBUEktR0VSRU5DSUFMIiwic3ViIjoiaW5mb0BleHBpbm4uY29tLmNvIiwiS2V5IjoiM1hQMU5OX1QzQ0hOMEwwNlkiLCJVc2VyIjoiQVBQR0VSRU5DSUFMIiwiUGFzc3dvcmQiOiJwV1dpQVFvdDVWRFpSMVY2UExYR0xBPT0iLCJJZGVudGlmaWNhY2lvbiI6IkVYUElOTkFETSIsIkNsYXZlIjoiMTIzNDU2In0.O5ZjT_0eS-LEWlLQClQgoLLLFnOCp9e22j9hbCiMz94`,
          },
        }
      )
      .then((res) => {
        setPastDuePortfolio(res.data.cartera_vencida);
        setCommonReason(res.data.razon_corriente);
      });
  }, [selectedDate]);

  const setDataWithoutRepeatsAccounts = (
    estadosFinancieros: EstadoFinanciero[]
  ) => {
    const nombresVistos: Record<string, boolean> = {};
    const estadosFiltrados: EstadoFinanciero[] = [];

    for (const estado of estadosFinancieros) {
      if (!nombresVistos[estado.nombre_cuenta]) {
        nombresVistos[estado.nombre_cuenta] = true;
        estadosFiltrados.push(estado);
      }
    }

    setData(estadosFiltrados);
  };

  const getUniqueDates = (dates: any) => {
    const uniqueDates: Record<string, boolean> = {};
    const datesFiltered = dates.filter((date: any) => {
      const dateStr = date.fecha.slice(0, 10);
      if (!uniqueDates[dateStr]) {
        uniqueDates[dateStr] = true;
        return true;
      }
      return false;
    });
    setAvailableDates(datesFiltered.reverse());
  };

  return (
    <div className="main-container">
      <div className="header">
        <div className="header-name">
          <div className="back-arrow">
            <img
              style={{ width: "22px", height: "22px" }}
              src={backArrow}
              alt=""
              onClick={() => history.push("/dashboard")}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ marginBottom: 0 }}>
              <b>Hola, {username}</b>
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
      <p className="title">
        <b>ESTADOS FINANCIEROS</b>
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <IonList color="primary">
          <IonItem style={{ color: "#000" }}>
            <IonSelect
              aria-label="Favorite Fruit"
              value={selectedDate}
              onIonChange={(e) => setSelectedDate(e.target.value)}
            >
              {availableDates.map((date: any) => (
                <IonSelectOption value={date?.fecha.slice(0, 10)}>
                  {date?.fecha.slice(0, 10)}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonList>
      </div>
      <p className="title">
        <b>BALANCE</b>
      </p>
      <div className="table">
        {data.length > 0 &&
          data.map((row: any, index: number) => (
            <div className="row">
              <span className={`title-box theme${index}`}>
                {row.nombre_cuenta}
              </span>
              <span className="amount-box">{row?.valor?.toLocaleString()}</span>
            </div>
          ))}
      </div>
      <p className="title">
        <b>INDICADORES</b>
      </p>
      <div className="indicator-table">
        <div className="indicator-row">
          <span className="indicator-title-box">RAZON CORRIENTE</span>
          <span className="amount-box">{commonReason}</span>
        </div>
        <div className="indicator-row">
          <span className="indicator-title-box">CARTERA VENCIDA</span>
          <span className="amount-box">{pastDuePortfolio}</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatements;
