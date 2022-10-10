import { useMeQuery } from '@data/user/use-me.query';
import { MessageSharp } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
const Dispute = () => {
  const { id = '' } = useRouter().query;
  const { data: user, isLoading: loading, error } = useMeQuery();

  const [data, setData] = useState<any | null>(null);
  const fetchData = async () => {
    const tkn = Cookies.get('AUTH_CRED')!;
    if (!tkn) return;
    const { token } = JSON.parse(tkn);

    const res = await axios.get('/dispute/' + id, {
      headers: {
        authorization: 'Bearer ' + token,
      },
    });
    setData(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  if (!data || !user) return <>loading...</>;
  return (
    <div className="flex h-screen text-gray-800 antialiased">
      <div className="flex h-full w-full flex-row overflow-x-hidden">
        <div className="flex w-64 flex-shrink-0 flex-col bg-white py-8 pl-6 pr-2">
          <div className="justify-star-4 ml-4 flex h-12 w-full flex-row items-center">
            {'<-'}
            <div className="ml-1 text-left text-2xl font-bold">Atras</div>
          </div>
          <div className="mt-4 flex w-full flex-col items-center rounded-lg border border-gray-200 bg-indigo-100 py-6 px-4">
            {/* <div className="h-20 w-20 overflow-hidden rounded-full border">
              <img
                src="https://avatars3.githubusercontent.com/u/2763884?s=128"
                alt="Avatar"
                className="h-full w-full"
              />
            </div>
            <div className="mt-2 text-sm font-semibold">Aminos Co.</div>
            <div className="text-xs text-gray-500">Lead UI/UX Designer</div>
            <div className="mt-3 flex flex-row items-center">
              <div className="flex h-4 w-8 flex-col justify-center rounded-full bg-indigo-500">
                <div className="mr-1 h-3 w-3 self-end rounded-full bg-white"></div>
              </div>
              <div className="ml-1 text-xs leading-none">Active</div>
            </div> */}
          </div>
        </div>
        <div className="flex h-full flex-auto flex-col p-6">
          <div className="flex h-full flex-auto flex-shrink-0 flex-col rounded-2xl bg-gray-100 p-4">
            <div className="mb-4 flex h-full flex-col overflow-x-auto">
              <div className="flex h-full flex-col">
                <div className="grid grid-cols-12 gap-y-2">
                  {data.messages.map((message: any) =>
                    message.sender_id === user.id ? (
                      <MessageByMe content={message.content} />
                    ) : (
                      <MessageByOther content={message.content} />
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="flex h-16 w-full flex-row items-center rounded-xl bg-white px-4">
              <div>
                <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="ml-4 flex-grow">
                <div className="relative w-full">
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-xl border pl-4 focus:border-indigo-300 focus:outline-none"
                  />
                  <button className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-gray-400 hover:text-gray-600">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="ml-4">
                <button className="flex flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600">
                  <span>Enviar</span>
                  <span className="ml-2">
                    <svg
                      className="-mt-px h-4 w-4 rotate-45 transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dispute;

const MessageByOther = ({ content }: { content: string }) => {
  return (
    <div className="col-start-1 col-end-8 rounded-lg p-3">
      <div className="flex flex-row items-center">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
          C
        </div>
        <div className="relative ml-3 rounded-xl bg-white py-2 px-4 text-sm shadow">
          <div>{content}</div>
        </div>
      </div>
    </div>
  );
};
const MessageByMe = ({ content }: { content: string }) => {
  return (
    <div className="col-start-6 col-end-13 rounded-lg p-3">
      <div className="flex flex-row-reverse items-center justify-start">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
          A
        </div>
        <div className="relative mr-3 rounded-xl bg-indigo-100 py-2 px-4 text-sm shadow">
          <div>{content}</div>
        </div>
      </div>
    </div>
  );
};
