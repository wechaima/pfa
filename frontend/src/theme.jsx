import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      primary: "#3182CE",
      primaryLight: "#EBF8FF",
      secondary: "#2C5282",
    },
    stem: {
      science: "#3B82F6",
      technology: "#10B981",
      engineering: "#F59E0B",
      mathematics: "#EF4444",
    },
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  components: {
    Button: {
      variants: {
        nav: {
          borderRadius: "full",
          px: 4,
          py: 2,
          fontWeight: "normal",
          color: "brand.primary",
          bg: "transparent",
          _hover: {
            bg: "brand.primaryLight",
          },
          _active: {
            bg: "brand.primary",
            color: "white",
          },
        },
      },
    },
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: "none",
        },
      },
      variants: {
        nav: {
          borderRadius: "full",
          px: 4,
          py: 2,
          fontWeight: "normal",
          color: "brand.primary",
          bg: "transparent",
          _hover: {
            bg: "brand.primaryLight",
          },
          _activeLink: {
            bg: "brand.primary",
            color: "white",
          },
        },
      },
    },
  },
});

export default theme;
