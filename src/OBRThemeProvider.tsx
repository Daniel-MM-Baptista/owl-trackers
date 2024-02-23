import { createTheme } from "@mui/material/styles";
import { Theme } from "@owlbear-rodeo/sdk";

/**
 * Create a MUI theme based off of the current OBR theme
 */
export function getTheme(theme?: Theme) {
  return createTheme({
    palette: theme
      ? {
          mode: theme.mode === "LIGHT" ? "light" : "dark",
          text: theme.text,
          primary: theme.primary,
          secondary: theme.secondary,
          background: theme?.background,
        }
      : undefined,
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiTooltip: {
        defaultProps: {
          disableInteractive: true,
        },
      },
    },
  });
}

/**
 * Provide a MUI theme with the same palette as the parent OBR window
 * WARNING: Doesn't work well for popover because it creates a flash when loading
 */
// export function OBRThemeProvider({
//     children,
// }: {
//     children?: React.ReactNode;
// }) {
//     const [theme, setTheme] = useState<MuiTheme>(() => getTheme());
//     useEffect(() => {
//         const updateTheme = (theme: Theme) => {
//             setTheme(getTheme(theme));
//         };
//         OBR.theme.getTheme().then(updateTheme);
//         return OBR.theme.onChange(updateTheme);
//     }, []);

//     return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
// }
