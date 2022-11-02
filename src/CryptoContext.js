import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { CoinList } from "./config/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success"
  });

  const [watchlist, setwatchlist] = useState([]);

  useEffect(() => {
    if(user) {
      const coinRef = doc(db, "watchlist", user.uid);

      var unSubscribe = onSnapshot(coinRef, coin=> {
        if(coin.exists()) {
          console.log("coins in watchlist: ", coin.data().coins);
          setwatchlist(coin.data().coins);
        } else {
          console.log("No items in Watchlist");
        }
      });

      return () => {
        unSubscribe();
      };
    }
  }, [user])
  
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) setUser(user);
      else setUser(null);

      console.log(user);
    });
  }, [])


  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));

    setCoins(data);
    setLoading(false);

    console.log("CoinTable List: ", data);
  };


  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  return (
    <Crypto.Provider value={{ 
          currency, 
          setCurrency, 
          symbol, 
          coins, 
          loading, 
          fetchCoins, 
          alert, setAlert, 
          user,
          watchlist 
        }}
      >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
