import { ThemeProvider } from "@/shared/ui-kit";

import { Router } from "./pages";

function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}

export default App;
