type OriginalCode =
  | "internal_server_error"
  | "no_authorization"
  | "request_timeout";

export type SupabaseError = {
  originalCode: OriginalCode;
  currentCode: string;
  title?: string;
  message: string;
  status: number;
};

const ErrorMap: Record<OriginalCode, SupabaseError> = {
  internal_server_error: {
    originalCode: "internal_server_error",
    currentCode: "InternalServerError",
    title: "ネットワークエラー",
    message:
      "サーバーとの通信に失敗しました。しばらく経ってから再度お試しください。",
    status: 500,
  },
  no_authorization: {
    originalCode: "no_authorization",
    currentCode: "NoAuthorization",
    title: "認証エラー",
    message: "認証情報が有効ではありません。再度ログインしてください。",
    status: 401,
  },
  request_timeout: {
    originalCode: "request_timeout",
    currentCode: "RequestTimeout",
    title: "タイムアウトエラー",
    message:
      "リクエストがタイムアウトしました。しばらく経ってから再度お試しください。",
    status: 408,
  },
};

export const getErrorMessage = (error: unknown): SupabaseError => {
  // error.codeがOriginalCodeのいずれかに一致する場合は、そのエラーを返す
  const originalCode =
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : "internal_server_error";

  return ErrorMap[originalCode as OriginalCode];
};
