import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { CryptoState } from '../../CryptoContext';
import { Avatar, Button } from '@material-ui/core';
import { AiFillDelete } from 'react-icons/ai';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { numberWithCommas } from '../CoinsTable';
import { doc, setDoc } from 'firebase/firestore';

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "monospace",
    backgroundColor: "#e6e6e6",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%"
  },
  picture: {
    width: 200,
    height: 200,
    color: "#606060",
    boxShadow: "-5px -5px 10px rgba(255, 255, 255, 1.2), 5px 5px 15px rgb(70, 70, 70, 0.25)",
    backgroundColor: "#ececec",
    objectFit: "contain",
    textTransform: "uppercase",
  },
  logout: {
    height: "8%",
    width: "100%",
    color: "#606060",
    boxShadow: "-10px -10px 15px rgba(255, 255, 255, 1.2), 10px 10px 15px rgb(70, 70, 70, 0.18)",
    backgroundColor: "#ececec",
    "&:hover": {
      backgroundColor: "#505050",
      color: "#ececec",
    },
    marginTop: 25
  },
  watchList: {
    flex: 1,
    width: "100%",
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflowY: "scroll"
  },
  watchlistItem: {
    padding: 10,
    borderRadius: 5,
    color: "#606060",
    boxShadow: "-5px -5px 15px rgba(255, 255, 255, 0.6), 10px 10px 20px rgb(70, 70, 70, 0.12)",
    backgroundColor: "#ececec",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default function UserSideBar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const { user, setAlert, watchlist, coins, symbol } = CryptoState();

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const removeFromWatchlist = async (coin) => {
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

  const logout = () => {
    signOut(auth);

    setAlert({
      open: true,
      message: "Logout Successfull !",
      type: "success"
    });

    toggleDrawer();
  };

  console.log("photoURL: ", user.photoURL);

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: "pointer",
              backgroundColor: "#606060",
              textTransform: "uppercase",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}
                </span>

                <div className={classes.watchList} >
                  <span style={{ fontSize: 15, textShadow: '1px 1px 5px #808080', color: "black" }}>
                    Watchlist
                  </span>

                  { // eslint-disable-next-line
                    coins.map((coin) => {
                      if (watchlist.includes(coin.id))
                        return (
                          <div className={classes.watchlistItem} key={coin.id}>
                            <span>{coin.name}</span>
                            <span style={{ display: "flex", gap: 8 }}>
                              {symbol}
                              {numberWithCommas(coin.current_price.toFixed(2))}
                              <AiFillDelete
                                style={{ cursor: "pointer" }}
                                fontSize="16"
                                onClick={() => removeFromWatchlist(coin)}
                              />
                            </span>
                          </div>
                        )
                    })
                  }
                </div>
              </div>

              <Button
                variant='contained'
                className={classes.logout}
                onClick={logout}
              >
                Log Out
              </Button>


            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
