import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const Home = () => {
  const [typeingStatus, setTypeingStatus] = useState("human1");

//  const test = async () => {
//   await fetch("http://localhost:3000/api/test",{
//     credentials:"include"
//   })
//  }

  return (
    <div className="flex items-center gap-24 h-[100%] max-lg:flex-col max-lg:gap-0">
      <img
        src="/orbital.png"
        alt="background-img"
        className="absolute bottom-0 left-0 opacity-10 animate-rotate -z-[1]"
      />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-8xl font-medium bg-gradient-to-r from-[#217bfe] to-[#e55571] bg-clip-text text-transparent max-xl:text-6xl">
          Developer AI
        </h1>
        <h2 className="font-semibold">
          Super charge Your Creativity and Productivity
        </h2>
        <h3 className="font-normal max-w-fit max-lg:max-w-[100%]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
          reiciendis impedit aliquid ab praesentium quia numquam magnam maiores,
          dolor non
        </h3>
        <Link
          to="/dashboard"
          className="px-5 py-3 bg-[#217bfe] rounded-2xl hover:bg-white hover:text-[#217bfe]"
        >
          Get Started
        </Link>
        {/* <button onClick={test}>test backend</button> */}
       
      </div>
      <div className="flex-1 flex items-center justify-center h-[100%] z-10">
        <div className="relative flex items-center justify-center bg-[#140e2d] rounded-2xl w-[80%] h-[50%]">
          <div className="w-[100%] h-[100%] overflow-hidden absolute top-0 left-0 rounded-2xl">
            <div className="bg-[url('/bg.png')] opacity-20 w-[200%] h-[100%] bg-contain animate-slideBg"></div>
          </div>
          <img
            src="/bot.png"
            alt="BOT img"
            className="w-[100%] h-[100%] object-contain animate-zoom"
          />
          <div className="absolute -bottom-7 -right-12 flex items-center gap-2 p-5 bg-[#2c2937] rounded-lg max-lg:hidden max-xl:right-0">
            <img
              src={
                typeingStatus === "human1"
                  ? "/human1.jpeg"
                  : typeingStatus === "human2"
                  ? "/human2.jpeg"
                  : "bot.png"
              }
              alt=""
              className="size-8 rounded-2xl object-cover"
            />
            <TypeAnimation
              sequence={[
                "John: How are you",
                2000,
                () => {
                  setTypeingStatus("bot");
                },
                "Bot: I am fine . How are you",
                2000,
                () => {
                  setTypeingStatus("human2");
                },
                "jane: What is 1+1",
                2000,
                () => {
                  setTypeingStatus("bot");
                },
                "Bot: 2",
                2000,
                () => {
                  setTypeingStatus("human1");
                },
              ]}
              wrapper="span"
              // speed={50}
              // style={{ fontSize: '2em', display: 'inline-block' }}
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5">
        <img src="/logo.png" alt="" className="size-4"/>
        <div className="flex gap-2 text-gray-600">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Private Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
