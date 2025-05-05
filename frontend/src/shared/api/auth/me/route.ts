type ResDTO = {
  message: string;
  user: {
    id: number;
    login_id: string;
    password: string;
    nickname: string;
    role: string;
    refresh_token: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    last_login_at: string;
    profile_image_url: string;
    email_verified: boolean;
  };
};

async function POST() {
  const res = await fetch("/api/auth/me", {
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

export const authRefreshTokenApi = {
  POST,
};
