export type CommonResDTO = {
  message: string;
};

export type PagableQueryDTO = {
  page: number;
  size: number;
  sort: "created_at" | "original_name";
  order: "asc" | "desc";
};

export type PagableDTO = {
  pagination: {
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
  };
};
