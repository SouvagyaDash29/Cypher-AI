import { useEffect, useRef, useState } from "react";
import Upload from "./Upload";
import { IKImage } from "imagekitio-react";
import model from "../lib/gemini";
import Markdown from "react-markdown";
import "./Test.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({data}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    generationConfig: {
      // maxOutputTokens: 1000,
      // temperature: 0.1,
    },
  });

  const endRef = useRef();
  const formRef = useRef();

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT", 
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
         }),
      }).then((res)=>res.json());
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] })
      .then(()=>{
        formRef.current.reset();
        setQuestion("");
        setAnswer("");
        setImg({
          isLoading: false,
          error: "",
          dbData: {},
          aiData: {},
      })
      });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const add = async (text, isInitial) => {
    if(!isInitial)setQuestion(text);

    // const response = await result.response;
    try{
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );
    let accumulatedText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      // console.log(chunkText);
      accumulatedText += chunkText;
      setAnswer(accumulatedText);
    }
    mutation.mutate();
  }catch(error){
    console.log(error);
  }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false);
   
  };

  //IN PRODUCTION WE DID NT NEED THIS
  const hasRun = useRef(false)
  useEffect(()=> {
    if(!hasRun.current){
    if(data?.history?.length === 1){
      add(data.history[0].parts[0].text, true);
    }
  }
  hasRun.current = true
  },[])

  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <div>Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && (
        <div className="bg-[#2c2937] p-3 rounded-[20px] max-w-[80%] self-end">
          {question}
        </div>
      )}
      {answer && (
        <div className="user">
          <Markdown className="list-disc">{answer}</Markdown>
        </div>
      )}
      <div className="pb-20" ref={endRef}></div>
      <form
        onSubmit={handleSubmit} ref={formRef}
        className="w-[51.2%] absolute bottom-2 bg-[#2c2937] rounded-2xl flex items-center gap-5 py-0 px-5"
      >
        <Upload setImg={setImg} />
        <input
          id="file"
          type="file"
          multiple={false}
          hidden
          className="flex-1 p-5 border-none outline-none bg-transparent text-[#ececec]"
        />
        <input
          type="text"
          name="text"
          placeholder="Ask anything...."
          className="flex-1 p-5 border-none outline-none bg-transparent text-[#ececec]"
        />
        <button className="rounded-[50%] bg-[#605e68] p-2 cursor-pointer border-none flex items-center justify-center">
          <img src="/arrow.png" alt="" className="size-4" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
