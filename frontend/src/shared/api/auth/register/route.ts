import { AuthRegisterReqDTO, AuthRegisterResDTO } from "@dto/auth.dto";

async function POST(body: AuthRegisterReqDTO) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: AuthRegisterResDTO = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export const authRegisterApi = {
  POST,
};
