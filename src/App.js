import "./App.css";
import { makeStyles } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./pages/HomePage";
import CoinPage from "./pages/CoinPage";

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#ececec",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Route path="/" component={Homepage} exact />
        <Route path="/coins/:id" component={CoinPage} exact />
      </div>
    </BrowserRouter>
  );
}

export default App;
