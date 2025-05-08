import MuiThemeProvider from "@app/MuiThemeProvider";
import ReactQueryProvider from "@app/ReactQueryProvider";
import RouterProvider from "@app/RouterProvider";
import GlobalSnackbar from "@entities/GlobalSnackbar";
import GlobalModal from "@shared/components/GlobalModal";

function App() {
  return (
    <ReactQueryProvider>
      <MuiThemeProvider>
        <GlobalModal>
          <GlobalSnackbar>
            <RouterProvider />
          </GlobalSnackbar>
        </GlobalModal>
      </MuiThemeProvider>
    </ReactQueryProvider>
  );
}

export default App;
