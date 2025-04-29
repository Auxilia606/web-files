import { redirect } from "react-router-dom";

import { authRefreshTokenApi } from "shared/api/auth/refresh-token/route";

const MainPage = () => {
  return <div>Main</div>;
};

const Main = Object.assign(MainPage, { loader });

export default Main;

async function loader() {
  const accessToken = sessionStorage.getItem("access-token");

  if (!accessToken) {
    try {
      const { result } = await authRefreshTokenApi.POST();

      sessionStorage.setItem("access-token", result.accessToken);
      return null;
    } catch {
      return redirect("/login");
    }
  }

  return null;
}
