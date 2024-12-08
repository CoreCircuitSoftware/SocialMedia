// Button.styles.jsx
import { styled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";

const StyledButton = styled(({ colorVariant, pill, ...otherProps }) => (
  <MuiButton {...otherProps} />
))(({ theme, colorVariant, pill }) => {
  const colorOptions = {
    primary: {
      backgroundColor: theme.palette.primary.main,
      hoverColor: theme.palette.primary.dark,
    },
    secondary: {
      backgroundColor: theme.palette.secondary.main,
      hoverColor: theme.palette.secondary.dark,
    },
    customGreen: {
      backgroundColor: theme.palette.customGreen.main,
      hoverColor: theme.palette.customGreen.dark,
    },
  };

  const colors = colorOptions[colorVariant] || colorOptions.primary;

  return {
    borderRadius: pill ? theme.shape.pillRadius : theme.shape.borderRadius,
    padding: "8px 16px",
    backgroundColor: colors.backgroundColor,
    color: theme.palette.common.white,
    textTransform: "none",
    '&:hover': {
      backgroundColor: colors.hoverColor,
    },
  };
});

export default StyledButton;
