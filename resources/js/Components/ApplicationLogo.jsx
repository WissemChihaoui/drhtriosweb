import { useThemeProvider } from "@/utils/ThemeContext";

export default function ApplicationLogo(props) {
    const { currentTheme } = useThemeProvider();
   return currentTheme === "light" ? <img src="/logo.png" alt="" {...props}/>   : <img src="/logo.png" alt="" {...props} style={{filter:'invert(1)'}}/> 
}
