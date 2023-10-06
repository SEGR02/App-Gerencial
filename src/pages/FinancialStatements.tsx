import { IonContent, IonPage } from "@ionic/react";
import FinancialStatements from "../components/FinancialStatements";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <FinancialStatements />
      </IonContent>
    </IonPage>
  );
};

export default Home;
