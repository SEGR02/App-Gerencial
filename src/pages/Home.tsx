import { IonContent, IonPage } from "@ionic/react";
import Login from "../components/Login";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Login />
      </IonContent>
    </IonPage>
  );
};

export default Home;
