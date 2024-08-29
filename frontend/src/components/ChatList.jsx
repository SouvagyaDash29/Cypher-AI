import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="flex flex-col h-[100%] ">
      <span className="font-semibold text-xs mb-3">DASHBOARD</span>
      <Link to="/dashboard" className="mb-1">Create a new chat</Link>
      <Link to="/" className="mb-1">Explore Cypher AI</Link>
      <Link to="/" className="mb-1">Contact</Link>
      <hr className="border-none h-[2px] bg-[#ddd] opacity-10 rounded-md mx-0 my-5" />
      <span className="font-semibold text-xs mb-3">RECENT CHAT</span>
      <div className="flex flex-col-reverse overflow-y-scroll no-scrollbar">
        {/* <Link to="/" className="p-2 rounded-xl hover:bg-[#2c2937]">
          My chat Title
        </Link> */}
        {isPending
          ? "Loading..."
          : error
          ? "Something went wrong!"
          : data?.map((chat) => (
              <Link
                key={chat._id}
                to={`/dashboard/chats/${chat._id}`}
                className="p-2 rounded-xl hover:bg-[#2c2937]"
              >
                {chat.title}
              </Link>
            ))}
      </div>
      <hr className="border-none h-[2px] bg-[#ddd] opacity-10 rounded-md mx-0 my-5" />
      <div className="mt-auto flex items-center gap-2 text-xs">
        <img src="/logo.png" alt="logo" className="size-6" />
        <div className="flex flex-col">
          <span className="font-semibold">Upgrade to Cypher AI Pro</span>
          <span className="text-[#888]">
            Get unlimited access to all features
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
