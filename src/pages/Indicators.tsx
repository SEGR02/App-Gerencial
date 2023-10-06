import { IonContent, IonPage } from "@ionic/react";
import Indicators from "../components/Indicators";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Indicators />
      </IonContent>
    </IonPage>
  );
};

export default Home;
