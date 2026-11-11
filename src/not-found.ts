import "./styles.css";
import { initRipple } from "./runtime/components.ts";
import { initLoaders } from "./runtime/morphs.ts";
import { installSpringTokens } from "./runtime/motion.ts";
import { initTheme } from "./runtime/theme.ts";

installSpringTokens();
initTheme();
initLoaders();
initRipple();
