import { IonContent, IonPage } from "@ionic/react";
import Dashboard from "../components/Dashboard";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Dashboard />
      </IonContent>
    </IonPage>
  );
};

export default Home;
