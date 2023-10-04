import { Distribution } from "@/types";

export interface CalcEvent {
  id: string;
  name: string;
  sum_amount: number;
  create_user: string;
  event_date: string;
  distributions: Distribution[];
}
