type ResDTO = {
  message: string;
};

async function GET() {
  const res = await fetch("/api/auth/check-status", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data: ResDTO = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export const authCheckStatusApi = {
  GET,
};
