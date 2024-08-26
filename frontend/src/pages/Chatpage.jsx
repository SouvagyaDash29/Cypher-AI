import { useLocation } from "react-router-dom";
import NewPrompt from "../components/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

const Chatpage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
      
  });

  return (
    <div className="h-full flex flex-col items-center ">
      <div className="flex-1 overflow-y-auto no-scrollbar w-full flex justify-center">
        <div className="w-[70%] flex flex-col gap-5 ">
          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong"
            : data?.history?.map((message, i) => (
              <>
              {message.img && (
                <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                path= {message.img}
                height="300"
                width="400"
                transformation={[{ height: 300, width:400 }]} 
                loading="lazy"
                lqip={{ active: true, quality:20 }}
                className="self-end"
                /> 
              )}
                <div
                  className={
                    message.role === "user"
                      ? "bg-[#2c2937] py-3 px-4 rounded-2xl max-w-[80%] self-end"
                      : "p-5 w-[90%]"
                  }
                  key={i}
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
                </>
              ))}
          {/* <div className="bg-[#2c2937] p-3 rounded-[20px] max-w-[80%] self-end">
            user Message Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Delectus non commodi amet sed, nobis nisi alias nihil? Illum
            ipsam ullam perferendis vitae debitis? Cum incidunt possimus dicta
            molestiae quasi at.
          </div>
          <div className="p-5 w-[90%]">
            AI Message Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Amet, laboriosam, possimus sed aliquid vitae quibusdam expedita
            similique at eos optio non sapiente tempora, aut deserunt ad neque
            sint esse iusto?
          </div>*/}
          {data && <NewPrompt data={data}/>}
        </div>
      </div>
    </div>
  );
};

export default Chatpage;
