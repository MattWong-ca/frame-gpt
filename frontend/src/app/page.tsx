"use client";
import Image from "next/image";
import { Space_Grotesk } from 'next/font/google'
import { ChangeEvent, useState } from "react";
import './globals.css';
import OpenAI from "openai";


const space500 = Space_Grotesk({ subsets: ['latin'], weight: ["500"], style: ["normal"] });
const space400 = Space_Grotesk({ subsets: ['latin'], weight: ["400"], style: ["normal"] });

export default function Home() {
  const placeholder = 'Frame Name: Just build it.\n\n--Frame One--\nTitle: Mint Page\nImage URL: https://cloudflare-ipfs.com/ipfs/QmUYMKFHqwxyX6LpZyGT7LMcDmo7SdoKmrQVXvPa8zkk9k\nImage ratio: 1:1\nButtons:\n1. "Mint", uses this contract: 0xb0d94258bcee18c3fcfbd6b0ac336cdf4e2b67a9';
  const [inputData, setInputData] = useState(placeholder);
  const [isMakeFrame, setIsMakeFrame] = useState(true);
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(event.target.value);
  };
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


  // async function test() {
  //   const completion = await openai.chat.completions.create({
  //     messages: [{ role: "system", content: "You are a helpful assistant." }],
  //     model: "gpt-3.5-turbo",
  //   });
  
  //   console.log(completion.choices[0]);
  // }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(inputData);
    // test();
  }

  return (
    <div className="overflow-hidden h-screen flex flex-col items-center">
      <div className={`${space500.className} text-3xl`} style={{ marginTop: '5vh' }}>FrameGPT</div>
      <div className={`${space500.className} text-2xl`} style={{ marginTop: '5px' }}>Make a frame that mints a Base NFT</div>
      <div className="w-80 h-8 rounded mt-5 border-2 flex" style={{ borderColor: '#7c65c1' }}>
        <div className="w-1/2 h-full border-r-2 flex flex-col justify-center" style={{ backgroundColor: isMakeFrame ? '#7c65c1' : 'white', borderColor: '#7c65c1' }}>
          <div onClick={() => setIsMakeFrame(true)} className={`${space500.className} text-md text-center text-white`} style={{ color: isMakeFrame ? 'white' : '#7c65c1' }}>Make a Frame</div>
        </div>
        <div className="w-1/2 h-full flex flex-col justify-center" style={{ backgroundColor: isMakeFrame ? 'white' : '#7c65c1' }}>
          <div onClick={() => setIsMakeFrame(false)} className={`${space500.className} text-md text-center`} style={{ color: isMakeFrame ? '#7c65c1' : 'white' }}>Examples</div>
        </div>
      </div>

      {isMakeFrame ? (
        <form onSubmit={handleSubmit} className="flex flex-col items-center mt-6">
          <div className={`${space400.className}`}>~ The input below works as is, hit Generate to try it out! ~</div>
          <textarea className={`${space400.className} rounded border border-gray-300 w-full h-96 p-2 overflow-x-auto`} style={{ whiteSpace: 'nowrap' }} value={inputData} onChange={handleChange}></textarea>
          <div className="w-36 h-8 rounded mt-5 flex flex-col justify-center" style={{ backgroundColor: '#7c65c1' }}>
            <div className=" flex flex-col justify-center">
              <button className={`${space500.className} text-md text-center text-white`}>✨ Generate ✨</button>
            </div>
          </div>
        </form>
      ) : (
        <div className={`${space400.className} flex flex-col items-center mt-6`}>
          <div>Coming soon!</div>
        </div>
      )}
    </div>
  );
}
