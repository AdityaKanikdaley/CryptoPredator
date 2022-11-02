import { makeStyles } from "@material-ui/core";

const SelectButton = ({ children, selected, onClick }) => {
  const useStyles = makeStyles({
    selectbutton: {
      // border: "2px solid black",
      borderRadius: "10px",
      padding: "10px 5px 10px 5px", // top-right-bottom-left
      fontFamily: "Montserrat",
      cursor: "pointer",

      // backgroundColor: selected ? "" : "",
      color: "#606060",
      boxShadow: "-10px -10px 15px rgba(255, 255, 255, 0.5), 10px 10px 15px rgb(70, 70, 70, 0.12)",
      backgroundColor: "#ececec",
      fontWeight: selected ? 700 : 500,
      "&:hover": {
        backgroundColor: "#505050",
        color: "#ececec",
      },
      width: "20%",
      textAlign: "center",
    },
  });

  const classes = useStyles();

  return (
    <span onClick={onClick} className={classes.selectbutton}>
      {children}
    </span>
  );
};

export default SelectButton;
