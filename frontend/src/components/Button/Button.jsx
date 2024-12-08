// components/Button/Button.jsx
import React from "react";
import StyledButton from "./Button.styles.jsx"; // Import the styled button

// Define the Button component
const Button = ({ variant, children, ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
