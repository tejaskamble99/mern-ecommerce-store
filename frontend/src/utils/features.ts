import { MessageResponse } from "@/types/api-types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";

type ResType =
  | {
      data: MessageResponse;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    };

export const responseToast = (
  res: ResType,
  router: AppRouterInstance | null,
  url: string,
) => {
    if("data" in res) {
      toast.success(res.data.message);
      if (router) router.push(url);
    } else{
        const error = res.error as FetchBaseQueryError ;
        const messageResponse = error.data as MessageResponse;
        toast.error(messageResponse.message);
    }
};

// export const getLastMonths = () => {
//   const currentDate = moment();
//   currentDate.date(1);
//   const last6Months: string[] = [];
//   const last12Months: string[] = [];

//   for (let i = 0; i < 6; i++) {
//     const monthDate = currentDate.clone().subtract(i, "months");
//     last6Months.unshift(monthDate.format("MMMM"));
//   }

//   for (let i = 0; i < 12; i++) {
//     const monthDate = currentDate.clone().subtract(i, "months");
//     last12Months.unshift(monthDate.format("MMMM"));
//   }

//   return { last12Months, last6Months };
// };

// export const transformImage = (url: string, width = 200) => {
//   return url.replace("upload/", `upload/dpr_auto/w_${width}/`);
// };


