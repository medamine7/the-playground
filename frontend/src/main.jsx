import ReactDOM from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./style/main.scss";
import "./style/fonts";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
