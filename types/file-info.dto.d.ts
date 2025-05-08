import { CommonResDTO, PagableDTO, PagableQueryDTO } from "./common.dto";

export type FileListReqDTO = PagableQueryDTO;

export type FileListResDTO = CommonResDTO &
  PagableDTO & {
    files: FileDTO[];
  };

export type FileDTO = {
  id: number;
  directory_id: number;
  file_name: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  thumbnail_path: string;
  uploader_id: number;
  view_count: number;
  download_count: number;
  comment: string;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  file_hash: string;
  media_created_at: string;
};
