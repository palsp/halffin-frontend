import ReactDOM from "react-dom";

// third party
import { BrowserRouter } from "react-router-dom";

// project imports
import * as serviceWorker from "serviceWorker";
import App from "App";
import { MoralisProvider } from "react-moralis";
// style + assets
import "assets/scss/style.scss";
import { ProductProvider } from "context";

// ==============================|| REACT DOM RENDER  ||============================== //

ReactDOM.render(
  <MoralisProvider
    appId={process.env.REACT_APP_MORALIS_APP_ID}
    serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}
  >
    <ProductProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProductProvider>
  </MoralisProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
