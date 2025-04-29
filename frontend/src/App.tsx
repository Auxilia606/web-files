import MuiThemeProvider from "@app/MuiThemeProvider";
import ReactQueryProvider from "@app/ReactQueryProvider";
import RouterProvider from "@app/RouterProvider";

function App() {
  return (
    <ReactQueryProvider>
      <MuiThemeProvider>
        <RouterProvider />
      </MuiThemeProvider>
    </ReactQueryProvider>
  );
}

export default App;
