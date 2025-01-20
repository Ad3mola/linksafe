import AppRouter from "./routing/AppRouter";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppKitProvider } from "./providers/AppkitProvider";

function App() {
  return (
    <AppKitProvider>
      <ToastContainer
        closeOnClick={true}
        autoClose={3000}
        hideProgressBar={true}
        draggable={false}
        limit={3}
        transition={Slide}
        pauseOnHover={true}
      />
      <AppRouter />
    </AppKitProvider>
  );
}

export default App;
