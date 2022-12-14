import { Button, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HTMLReactParser from "html-react-parser";
import HistogramGraph from "../components/HistogramGraph";
import { SingleCoin } from "../config/api";
import { numberWithCommas } from "../components/CoinsTable";
import { CryptoState } from "../CryptoContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));

    setCoin(data);
  };

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },
    heading: {
      fontWeight: "bold",
      color: "#505050",
      marginBottom: 10,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 5,
      paddingTop: 0,
      color: "#606060",
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      color: "#606060",

      // Making it responsive
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("md")]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
    watchlistBtn: {
      width: "100%",
      height: 40,
      marginTop: 10,
      border: "none",
      color: inWatchlist ? "white" : "#606060",
      backgroundColor: inWatchlist ? "#ff3300" : "#ececec",
      boxShadow: inWatchlist ?
        "-5px -5px 20px rgba(255, 153, 128, 0.6), 5px 5px 20px rgba(204, 41, 0, 0.6)"
        : "-10px -10px 15px rgba(255, 255, 255, 1.2), 10px 10px 15px rgb(70, 70, 70, 0.18)",
      "&:hover": {
        backgroundColor: inWatchlist ? "#ff3300" : "#ececec",
        color: inWatchlist ? "white" : "#606060",
      },
    }
  }));

  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist ? [...watchlist, coin?.id] : [coin?.id], //if watchlist is not empty the add current coin otherwise add current coin to that empty watchlist
        }
      );

      setAlert({
        open: true,
        message: `${coin.name} Added to the Watchlist !`,
        type: "success"
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error"
      });
    }
  }

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch !== coin?.id), //remove that coin from watchlist
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist !`,
        type: "success"
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error"
      });
    }
  }

  const classes = useStyles();

  if (!coin) return <LinearProgress style={{ backgroundColor: "#505050" }} />;

  return (
    <div className={classes.container}>

      {/* sidebar */}
      <div className={classes.sidebar}>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="180"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" className={classes.heading}>
          {coin?.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {HTMLReactParser(coin?.description.en.split(". ")[0])}.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>

          {user && (
            <Button
              className={classes.watchlistBtn}
              variant="outlined"
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}


        </div>
      </div>

      {/* chart */}
      <HistogramGraph coin={coin} />
    </div>
  );
};

export default CoinPage;
