type ReqDTO = {
  email: string;
  password: string;
};

async function POST(body: ReqDTO) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return Response.json({ data });
}

export const authRegisterApi = {
  POST,
};
