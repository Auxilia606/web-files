import { CommonResDTO } from "./common.dto";

export type AuthRegisterReqDTO = {
  loginId: string;
  password: string;
  nickname: string;
};

export type AuthRegisterResDTO = CommonResDTO;
