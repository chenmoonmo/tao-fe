import { useRef, useState } from "react";
import { toBytes } from "viem";
import { useAccount, useSignMessage } from "wagmi";

export const useSubmit = () => {
  const [value, setValue] = useState("");

  const timestamp = useRef(0);
  const { address } = useAccount();

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: async (sign) => {
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/addWork?worker=${address}&value=${value}&work_time=${timestamp.current}&i_type=1&worker_sign=${sign}`
        );

        setValue("");
      },
    },
  });

  const submitHandler = async () => {
    const datetimeObj = new Date();
    timestamp.current = Math.floor(datetimeObj.getTime() / 1000); // 将毫秒转为秒

    // 将消息和时间戳合并
    const messageBuffer = toBytes(value);

    const timestampBuffer = toBytes(BigInt(timestamp.current), { size: 32 });

    let textMessages = Buffer.concat([messageBuffer, timestampBuffer]);

    signMessage({
      message: {
        raw: textMessages,
      },
    });
    
  };

  return {
    value,
    setValue,
    submitHandler,
  };
};
