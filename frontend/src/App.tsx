import MuiThemeProvider from "@app/MuiThemeProvider";
import ReactQueryProvider from "@app/ReactQueryProvider";
import RouterProvider from "@app/RouterProvider";
import GlobalModal from "@shared/components/GlobalModal";

function App() {
  return (
    <ReactQueryProvider>
      <MuiThemeProvider>
        <GlobalModal>
          <RouterProvider />
        </GlobalModal>
      </MuiThemeProvider>
    </ReactQueryProvider>
  );
}

export default App;
