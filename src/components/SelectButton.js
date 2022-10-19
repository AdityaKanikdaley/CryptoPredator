import { makeStyles } from "@material-ui/core";

const SelectButton = ({ children, selected, onClick }) => {
  const useStyles = makeStyles({
    selectbutton: {
      border: "2px solid black",
      borderRadius: 5,
      padding: "10px 5px 10px 5px", // top-right-bottom-left
      fontFamily: "Montserrat",
      cursor: "pointer",
      // backgroundColor: selected ? "" : "",
      color: "black",
      fontWeight: selected ? 700 : 500,
      "&:hover": {
        backgroundColor: "#505050",
        color: "#ececec",
      },
      width: "24%",
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
