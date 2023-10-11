import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Indicators.css";
import user from "../assets/user-profile.png";
import backArrow from "../assets/left-arrow.png";
import { IonItem, IonList, IonSelect, IonSelectOption } from "@ionic/react";
import { useHistory } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; // Importa las componentes de zoom y panorámica

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
        display: false, // Oculta las rejillas verticales en el eje X
      },
      ticks: {
        display: true, // Oculta los números y los meses en el eje X
        font: {
          size: 3.2,
        },
      },
    },
    y: {
      grid: {
        display: true, // Muestra las rejillas horizontales en el eje Y
      },
      ticks: {
        display: true, // Oculta los números en el eje Y
        font: {
          size: 3.2,
        },
      },
    },
  },
};

interface ContainerProps {}

const Indicators: React.FC<ContainerProps> = () => {
  const username = localStorage.getItem("name");
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState("");
  const [graphicAsociatesData, setGraphicAsociatesData] = useState<any>({});
  const [graphicContributionsData, setGraphicContributionsData] = useState<any>(
    {}
  );
  const [graphicWalletsPerLine, setGraphicWalletsPerLine] = useState<any>({});
  const [graphicDepositsData, setGraphicDepositsData] = useState<any>({});
  const [graphicServicesData, setGraphicServicesData] = useState<any>({});
  const [availableDates, setAvailableDates] = useState<any>();
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
        `https://enlinea.coopcafam.coop/APIS/APPGERENCIAL/Indicadores/IndicadorAsociados?pFecha=${selectedDate}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXRUJBUEktR0VSRU5DSUFMIiwiaWF0IjoxNjk2MDQ4OTU4LCJleHAiOjE3Mjc1ODQ5NTgsImF1ZCI6IldFQiBBUEktR0VSRU5DSUFMIiwic3ViIjoiaW5mb0BleHBpbm4uY29tLmNvIiwiS2V5IjoiM1hQMU5OX1QzQ0hOMEwwNlkiLCJVc2VyIjoiQVBQR0VSRU5DSUFMIiwiUGFzc3dvcmQiOiJwV1dpQVFvdDVWRFpSMVY2UExYR0xBPT0iLCJJZGVudGlmaWNhY2lvbiI6IkVYUElOTkFETSIsIkNsYXZlIjoiMTIzNDU2In0.O5ZjT_0eS-LEWlLQClQgoLLLFnOCp9e22j9hbCiMz94`}`,
          },
        }
      )
      .then((res) => {
        if (res.data.length > 0) {
          obtenerDatosGrafico(
            res.data,
            "oficina",
            "numero_asociados",
            setGraphicAsociatesData
          );
        } else alert("Selecciona el ultimo dia del mes");
      });

    axios
      .post(
        `https://enlinea.coopcafam.coop/APIS/APPGERENCIAL/Indicadores/IndicadorAportes?pFecha=${selectedDate}&pRedondeo=1000000`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXRUJBUEktR0VSRU5DSUFMIiwiaWF0IjoxNjk2MDQ4OTU4LCJleHAiOjE3Mjc1ODQ5NTgsImF1ZCI6IldFQiBBUEktR0VSRU5DSUFMIiwic3ViIjoiaW5mb0BleHBpbm4uY29tLmNvIiwiS2V5IjoiM1hQMU5OX1QzQ0hOMEwwNlkiLCJVc2VyIjoiQVBQR0VSRU5DSUFMIiwiUGFzc3dvcmQiOiJwV1dpQVFvdDVWRFpSMVY2UExYR0xBPT0iLCJJZGVudGlmaWNhY2lvbiI6IkVYUElOTkFETSIsIkNsYXZlIjoiMTIzNDU2In0.O5ZjT_0eS-LEWlLQClQgoLLLFnOCp9e22j9hbCiMz94`}`,
          },
        }
      )
      .then((res) => {
        if (res.data.length > 0) {
          obtenerDatosGrafico(
            res.data,
            "oficina",
            "saldo",
            setGraphicContributionsData
          );
        }
      });

    axios
      .post(
        `https://enlinea.coopcafam.coop/APIS/APPGERENCIAL/Indicadores/IndicadorCartera?pFecha=${selectedDate}&pRedondeo=1000000`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXRUJBUEktR0VSRU5DSUFMIiwiaWF0IjoxNjk2MDQ4OTU4LCJleHAiOjE3Mjc1ODQ5NTgsImF1ZCI6IldFQiBBUEktR0VSRU5DSUFMIiwic3ViIjoiaW5mb0BleHBpbm4uY29tLmNvIiwiS2V5IjoiM1hQMU5OX1QzQ0hOMEwwNlkiLCJVc2VyIjoiQVBQR0VSRU5DSUFMIiwiUGFzc3dvcmQiOiJwV1dpQVFvdDVWRFpSMVY2UExYR0xBPT0iLCJJZGVudGlmaWNhY2lvbiI6IkVYUElOTkFETSIsIkNsYXZlIjoiMTIzNDU2In0.O5ZjT_0eS-LEWlLQClQgoLLLFnOCp9e22j9hbCiMz94`}`,
          },
        }
      )
      .then((res) => {
        if (res.data.length > 0) {
          obtenerDatosGrafico(
            res.data,
            "nombre",
            "saldo",
            setGraphicWalletsPerLine
          );
        }
      });

    axios
      .post(
        `https://enlinea.coopcafam.coop/APIS/APPGERENCIAL/Indicadores/IndicadorDepositos?pFecha=${selectedDate}&pRedondeo=1000000`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXRUJBUEktR0VSRU5DSUFMIiwiaWF0IjoxNjk2MDQ4OTU4LCJleHAiOjE3Mjc1ODQ5NTgsImF1ZCI6IldFQiBBUEktR0VSRU5DSUFMIiwic3ViIjoiaW5mb0BleHBpbm4uY29tLmNvIiwiS2V5IjoiM1hQMU5OX1QzQ0hOMEwwNlkiLCJVc2VyIjoiQVBQR0VSRU5DSUFMIiwiUGFzc3dvcmQiOiJwV1dpQVFvdDVWRFpSMVY2UExYR0xBPT0iLCJJZGVudGlmaWNhY2lvbiI6IkVYUElOTkFETSIsIkNsYXZlIjoiMTIzNDU2In0.O5ZjT_0eS-LEWlLQClQgoLLLFnOCp9e22j9hbCiMz94`}`,
          },
        }
      )
      .then((res) => {
        if (res.data.length > 0) {
          obtenerDatosGrafico(
            res.data,
            "PENDING",
            "PENDING",
            setGraphicDepositsData
          );
        }
      });

    axios
      .post(
        `https://enlinea.coopcafam.coop/APIS/APPGERENCIAL/Indicadores/IndicadorServicios?pFecha=${selectedDate}&pRedondeo=10000000`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXRUJBUEktR0VSRU5DSUFMIiwiaWF0IjoxNjk2MDQ4OTU4LCJleHAiOjE3Mjc1ODQ5NTgsImF1ZCI6IldFQiBBUEktR0VSRU5DSUFMIiwic3ViIjoiaW5mb0BleHBpbm4uY29tLmNvIiwiS2V5IjoiM1hQMU5OX1QzQ0hOMEwwNlkiLCJVc2VyIjoiQVBQR0VSRU5DSUFMIiwiUGFzc3dvcmQiOiJwV1dpQVFvdDVWRFpSMVY2UExYR0xBPT0iLCJJZGVudGlmaWNhY2lvbiI6IkVYUElOTkFETSIsIkNsYXZlIjoiMTIzNDU2In0.O5ZjT_0eS-LEWlLQClQgoLLLFnOCp9e22j9hbCiMz94`}`,
          },
        }
      )
      .then((res) => {
        if (res.data.length > 0) {
          obtenerDatosGrafico(
            res.data,
            "oficina",
            "saldo",
            setGraphicServicesData
          );
        }
      });
  }, [selectedDate]);

  interface DatosGrafico {
    etiquetas: string[];
    valores: number[];
  }

  function obtenerDatosGrafico<T>(
    datos: T[],
    nombrePropiedadEtiqueta: keyof T,
    nombrePropiedadValor: keyof T,
    setGraphicData: (data: DatosGrafico) => void
  ): void {
    const etiquetas: string[] = [];
    const valores: number[] = [];

    datos.forEach((elemento) => {
      etiquetas.push(String(elemento[nombrePropiedadEtiqueta]));
      valores.push(Number(elemento[nombrePropiedadValor]));
    });

    const datosGrafico: DatosGrafico = {
      etiquetas,
      valores,
    };

    setGraphicData(datosGrafico);
  }

  function crearDataSet(labels: any, valores: any) {
    const colores = [
      "rgba(170, 170, 170, 0.95)",
      "rgba(119, 119, 119, 0.95)",
      "rgba(51, 51, 51, 0.95)",
      "rgba(204, 204, 204, 0.95)",
      "rgba(255, 255, 255, 0.95)",
    ];

    return {
      labels,
      datasets: [
        {
          data: valores,
          backgroundColor: colores.slice(0, valores?.length),
        },
      ],
    };
  }

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
    <TransformWrapper>
      <TransformComponent>
        <div style={{ touchAction: "auto" }} className="main-container">
          <div className="header">
            <div className="header-name">
              <div
                className="back-arrow"
                onClick={() => history.push("/dashboard")}
              >
                <img
                  style={{ width: "22px", height: "22px" }}
                  src={backArrow}
                  alt=""
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ marginBottom: 0 }}>
                  <b>Hola, {username}</b>
                </p>
                <div onClick={() => setShowLogOut(!showLogOut)}>
                  <img
                    style={{ width: "22px", height: "22px" }}
                    src={user}
                    alt=""
                  />
                </div>
                <div
                  onClick={() => history.push("/home")}
                  style={
                    showLogOut ? { display: "block" } : { display: "none" }
                  }
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
            <b>INDICADORES</b>
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
                  {availableDates?.map((date: any) => (
                    <IonSelectOption value={date?.fecha.slice(0, 10)}>
                      {date?.fecha.slice(0, 10)}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonList>
          </div>
          <div className="container-graphics">
            <div className="graphics-titles">
              <p style={{ margin: 0, marginLeft: "15.5%" }} className="title">
                <b>ASOCIADOS</b>
              </p>
              <p style={{ margin: 0, marginRight: "18.5%" }} className="title">
                <b>APORTES</b>
              </p>
            </div>
            <div className="row-indicators">
              <div className="background-indicator">
                <Bar
                  style={{ touchAction: "auto" }}
                  className="graphic"
                  data={crearDataSet(
                    graphicAsociatesData.etiquetas,
                    graphicAsociatesData.valores
                  )}
                  options={options}
                />
              </div>
              <div className="background-indicator">
                <Bar
                  className="graphic"
                  data={crearDataSet(
                    graphicContributionsData.etiquetas,
                    graphicContributionsData.valores
                  )}
                  options={options}
                />
              </div>
            </div>
            <p style={{ margin: 0 }} className="title">
              <b>CARTERA POR LINEA</b>
            </p>
            <div className="alone-graphic">
              <Bar
                data={crearDataSet(
                  graphicWalletsPerLine.etiquetas,
                  graphicWalletsPerLine.valores
                )}
                options={options}
              />
            </div>
            <div className="graphics-titles">
              <p style={{ margin: 0, marginLeft: "15.5%" }} className="title">
                <b>DEPOSITOS</b>
              </p>
              <p style={{ margin: 0, marginRight: "18.5%" }} className="title">
                <b>SEVICIOS</b>
              </p>
            </div>
            <div className="row-indicators">
              <div className="background-indicator">
                <Bar
                  className="graphic"
                  data={crearDataSet(
                    graphicDepositsData.etiquetas,
                    graphicDepositsData.valores
                  )}
                  options={options}
                />
              </div>
              <div className="background-indicator">
                <Bar
                  className="graphic"
                  data={crearDataSet(
                    graphicServicesData.etiquetas,
                    graphicServicesData.valores
                  )}
                  options={options}
                />
              </div>
            </div>
          </div>
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
};

export default Indicators;
