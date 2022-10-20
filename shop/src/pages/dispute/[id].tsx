import { MessageSharp } from '@mui/icons-material';
import { Button } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import useUser from '@framework/auth/use-user';
import { Attachment } from '@framework/types';
import ContentLoader from 'react-content-loader';
import PageLoader from '@components/ui/page-loader/page-loader';
import Swal from 'sweetalert2';
import { getToken } from '@framework/utils/get-token';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
const Dispute = () => {
  const { id = '' } = useRouter().query;
  const router = useRouter();
  const { me: user } = useUser();
  const [data, setData] = useState<any | null>(null);
  useEffect(() => {
    fetchDispute({ setter: setData, id: id as string });
    const interval = setInterval(() => {
      fetchDispute({ setter: setData, id: id as string });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  console.log({ data });

  if (!data || !user) return <PageLoader />;
  return (
    <div className="flex h-screen text-gray-800 antialiased">
      <div className="flex h-full w-full flex-row overflow-x-hidden">
        <div className="flex w-64 flex-shrink flex-col bg-white py-8 pl-6 pr-2 justify-between">
          <div className="justify-star-4  flex h-12 w-full flex-row items-center">
            <div className="text-left text-2xl font-bold">
              <Button
                variant="text"
                onClick={() =>
                  router.push('/orders/' + data.order.tracking_number)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                  />
                </svg>
                <span className="ml-2" />
                Atras
              </Button>
            </div>
          </div>
          {/* <div className="mt-4 flex w-full flex-col items-center rounded-lg border border-gray-200 bg-indigo-100 py-6 px-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border">
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
            </div>
          </div> */}
          <Button
            variant="contained"
            color="error"
            disabled={data.status === 'closed'}
            onClick={() => {
              Swal.fire(deleteSwalConfig as any).then(async (result) => {
                if (result.isDenied) {
                  closeDispute({
                    router,
                    purchaseID: data.purchase_id,
                    disputeID: id as string,
                  });
                }
              });
            }}
          >
            Cerrar Reclamo
          </Button>
        </div>
        <MessageContainer data={data} user={user} setData={setData} id={id} />
      </div>
    </div>
  );
};

export default Dispute;

const MessageContainer = ({ data, user, setData, id }: any) => {
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState<Attachment | null>(null);
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    multiple: false,
    accept: ['image/*', '.pdf'],
    onDropAccepted: (options, ...rest) => {
      console.log({ rest });
      console.log({ options });
      upload(
        options, // it will be an array of uploaded attachments
        async (data) => {
          let mergedData;
          console.log(data);
          if (Array.isArray(data)) {
            mergedData = data[0];
            setFile(mergedData);
          } else {
            console.log('entrdhr');
            const url = await axios.get(
              process.env.NEXT_PUBLIC_REST_API_ENDPOINT +
                'attachments/' +
                data.id,
              {
                headers: {
                  Accept: 'application/json',
                },
              }
            );

            const attachment = {
              thumbnail: url.data.url!,
              original: url.data.url,
              id: data.id,
            };
            console.log(attachment);
            await handleSend({
              message: url.data.slug,
              type: options[0].type === 'application/pdf' ? 'pdf' : 'image',
            });
            mergedData = attachment!;
            console.log(attachment);
            setFile(attachment);
          }
        }
      );
    },
  });
  const messageRef = useRef<HTMLInputElement>(null);
  async function handleSend({
    message: content,
    type,
  }: {
    message: string;
    type: 'image' | 'text' | 'pdf';
  }) {
    setIsSending(true);
    try {
      const headers = getHeaders();
      if (!content) if (!headers) return setIsSending(false);
      await axios.post(
        '/customer-dispute/message',
        {
          dispute_id: id,
          type,
          content,
        },
        headers
      );

      await fetchDispute({ setter: setData, id: id as string });
      messageRef.current!.value = '';
    } finally {
      setIsSending(false);
    }
  }
  return (
    <div className="flex h-full flex-auto flex-col p-6 relative">
      <div className="flex h-full flex-auto flex-shrink-0 flex-col rounded-2xl bg-gray-100 p-4 relative">
        {data.status === 'closed ' && (
          <div className="absolute w-[100%] h-[100%] bg-[rgba(0,0,0,0.25)] -ml-[0.9rem] -mt-[0.95rem] rounded-[1rem] z-50 flex items-center justify-center">
            <span className="text-[#333] font-bold">Reclamo Cerrado</span>
          </div>
        )}
        <div className="mb-4 flex h-full flex-col overflow-x-auto">
          <div className="flex h-full flex-col">
            <div className="grid grid-cols-12 gap-y-2">
              {data.messages.map((message: any) => (
                <MessageWrapper
                  {...message}
                  sentByMe={message.sender_id === user.id}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex h-16 w-full flex-row items-center rounded-xl bg-white px-4 ">
          {data.status === 'opened' ? (
            <div {...getRootProps()}>
              <input {...getInputProps()} />

              <button className="flex items-center justify-center text-gray-400 hover:text-gray-600>">
                <svg
                  className="h-5 w-5 "
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
          ) : (
            <div>
              <button className="flex items-center justify-center text-gray-400 hover:text-gray-600> cursor-default">
                <svg
                  className="h-5 w-5 "
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
          )}
          <div className="ml-4 flex-grow">
            <div className="relative w-full">
              <input
                type="text"
                className="flex h-10 w-full rounded-xl border pl-4 focus:border-indigo-300 focus:outline-none"
                ref={messageRef}
              />
            </div>
          </div>
          <div className="ml-4">
            {data.status === 'opened' ? (
              <button
                className={`flex flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600 ${
                  isSending ? 'bg-[#999] hover:bg-[#777]' : ''
                }`}
                disabled={isSending}
                onClick={() =>
                  handleSend({
                    message: messageRef.current!.value,
                    type: 'text',
                  })
                }
              >
                {!isSending ? (
                  <>
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
                    </span>{' '}
                  </>
                ) : (
                  <ContentLoader />
                )}
              </button>
            ) : (
              <button
                className={`flex flex-shrink-0 items-center justify-center rounded-xl  px-4 py-1 text-white bg-[#999] cursor-default `}
                disabled={data.status === 'opened'}
              >
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
                </span>{' '}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageWrapper = (props: {
  content: string;
  type: 'pdf' | 'image' | 'text';
  sentByMe: boolean;
}) => {
  return (
    <div
      className={
        props.sentByMe
          ? 'col-start-6 col-end-13 rounded-lg p-3'
          : 'col-start-1 col-end-8 rounded-lg p-3'
      }
    >
      <div
        className={
          props.sentByMe
            ? 'flex flex-row-reverse items-center justify-start'
            : 'flex flex-row items-center'
        }
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
          {props.sentByMe ? 'A' : 'C'}
        </div>

        <MessageContent {...props} />
      </div>
    </div>
  );
};

const closeDispute = async ({
  router,
  purchaseID,
  disputeID,
}: {
  router: any;
  purchaseID: string;
  disputeID: string;
}) => {
  try {
    const headers = getHeaders();
    if (!headers) return;
    const res: any = await axios.patch(
      '/customer-dispute/' + purchaseID,
      {
        id: disputeID,
        status: 'closed',
      },
      headers
    );
    const { tracking_number }: { tracking_number: string } = res.data;
    if (!res) return Swal.fire('Ups!', 'Error al cerrar el reclamo.', 'error');
    router.push('/orders/' + tracking_number);
  } catch (e) {
    console.error(e);
  }
};

const fetchDispute = async ({
  setter,
  id,
}: {
  setter: React.Dispatch<React.SetStateAction<any>>;
  id: string;
}) => {
  try {
    const headers = getHeaders();
    if (!headers) return;
    const res = await axios.get('/customer-dispute/' + id, headers);
    setter(res.data);
  } catch (e) {}
};

const MessageContent = ({
  content,
  type,
}: {
  content: string;
  type: 'image' | 'pdf' | 'text';
}) => {
  return (
    <div className="relative mr-3 rounded-xl bg-indigo-100 py-2 px-4 text-sm shadow">
      <div>
        {type === 'image' ? (
          <div className="min-w-[150px] relative min-h-[150px]">
            <ImageWithFallback
              layout="fill"
              className="absolute"
              src={content}
              fallbackSrc={`https://www.publicdomainpictures.net/pictures/280000/nahled/not-found-image-15383864787lu.jpg`}
            />
          </div>
        ) : type === 'pdf' ? (
          <a href={content} target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
          </a>
        ) : (
          content
        )}
      </div>
    </div>
  );
};
const getHeaders = () => {
  const token = Cookies.get('auth_token');
  if (!token) return;
  return {
    headers: {
      authorization: 'Bearer ' + token,
    },
  };
};

const ImageWithFallback = (props: any) => {
  const { src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export const deleteSwalConfig = {
  title: '¿Estás seguro que quieres cerrar el reclamo?',
  icon: 'warning',
  showConfirmButton: false,
  showDenyButton: true,
  showCancelButton: true,
  denyButtonText: `Cerrar Reclamo`,
  cancelButtonText: 'Cancelar',
};

const upload = async (variables: any, callback: (data: any) => void) => {
  try {
    let formData = new FormData();
    variables.forEach((attachment: any) => {
      formData.append('attachment[]', attachment);
    });
    const token = getToken();
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await axios.post(
      'customer-attachments',
      formData,
      options
    );
    callback(response.data);
  } catch (e) {
    return null;
  }
};
