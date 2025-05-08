export type CommonResDTO = {
  message: string;
};

export type PagableQueryDTO = {
  page: number;
  size: number;
  /** "created_at" | "original_name" */
  sort: string;
  /** "asc" | "desc" */
  order: string;
};

export type PagableDTO = {
  pagination: {
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
  };
};
