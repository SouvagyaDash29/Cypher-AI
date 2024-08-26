import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const queryClient = useQueryClient();

  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({text}),
      }).then((res)=>res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userChats'] });
      navigate(`/dashboard/chats/${id}`);
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if(!text) return;

    mutation.mutate(text);
  }
  
  return (
    <div className="h-[100%] flex flex-col items-center">
      <div className="flex-1 flex flex-col items-center justify-center w-1/2 gap-12">
        <div className="flex items-center gap-5 opacity-20 ">
          <img src="/logo.png" alt="" className="size-16" />
          <h1 className="text-[64px] font-medium bg-gradient-to-r from-[#217bfe] to-[#e55571] bg-clip-text text-transparent max-xl:text-6xl">
            Developer AI
          </h1>
        </div>
      </div>
      <div className="w-[80%] pb-20 flex items-center justify-between gap-12">
        <div className="flex-1 flex flex-col gap-2 font-light text-sm p-5 border-[1px] border-solid border-[#555] rounded-lg">
          <img src="/chat.png" alt="" className="size-10 object-cover"/>
          <span>Create a New Chat</span>
        </div>
        <div className="flex-1 flex flex-col gap-2 font-light text-sm p-5 border-[1px] border-solid border-[#555] rounded-lg">
          <img src="/image.png" alt=""  className="size-10 object-cover"/>
          <span>Analyze Images</span>
        </div>
        <div className="flex-1 flex flex-col gap-2 font-light text-sm p-5 border-[1px] border-solid border-[#555] rounded-lg">
          <img src="/code.png" alt=""  className="size-10 object-cover"/>
          <span>Help me with my Code</span>
        </div>
      </div>
      <div className="mt-auto w-1/2 bg-[#2c2937] rounded-2xl">
        <form onSubmit={handleSubmit} className="w-[100%] h-[100%] flex items-center justify-between gap-5 mb-2">
          <input type="text" name="text" placeholder="Ask me Anything" className="flex-1 p-4 bg-transparent border-none outline-none"/>
          <button className="bg-[#605e68] rounded-full border-none cursor-pointer p-3 flex items-center justify-center mr-3">
            <img src="/arrow.png" alt="" className="size-4"/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
