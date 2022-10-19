import { makeStyles, CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { TrendingCoins } from "../config/api";
import { CryptoState } from "../CryptoContext";

const useStyles = makeStyles((theme) => ({
  carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    
    margin: "10px",
    padding: "8px",
    alignItems: "center",
    justifyContent: "center",
    
    cursor: "pointer",
    textTransform: "uppercase",
    transform: "translate(0%, -6%)",
    outline: "none",
    
    color: "#606060",
    boxShadow: "-10px -10px 15px rgba(255, 255, 255, 0.5), 10px 10px 15px rgb(70, 70, 70, 0.12)",
    backgroundColor: "#ececec",
    
    // border: "8px solid #ececec",
    borderRadius: "10px",
  },
}));

const useStylesFacebook = makeStyles((theme) => ({
  style: {
    color: '#505050',
    margin: 'auto'
  }
}));

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {

  const classes = useStyles();
  const circularClasses = useStylesFacebook();

  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currency, symbol } = CryptoState();

  const fetchTrendingCoins = async () => {
    // setLoading(true); // preventing memory leak
    const { data } = await axios.get(TrendingCoins(currency));

    setTrending(data);
    setLoading(false);
    console.log("Carousel List: ", data);
  };

  useEffect(() => {
    fetchTrendingCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);


  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;

    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        <img
          src={coin?.image}
          alt={coin.name}
          height="80em"
          style={{ marginBottom: 10 }}
        />
        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
              fontWeight: 500,
              fontSize: "1.0rem"
            }}
          >
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    loading ? (
      <CircularProgress
        variant="indeterminate"
        className={circularClasses.style}
        thickness={4}
      />
    ) : (
      <div className={classes.carousel}>
        <AliceCarousel
          mouseTracking
          infinite
          autoPlayInterval={1000}
          animationDuration={1500}
          disableDotsControls
          disableButtonsControls
          responsive={responsive}
          items={items}
          autoPlay
        />
      </div>)
  );
};

export default Carousel;