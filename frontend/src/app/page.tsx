"use client";
import Image from "next/image";
import { Space_Grotesk } from 'next/font/google'
import { ChangeEvent, useState } from "react";
import './globals.css';
const space500 = Space_Grotesk({ subsets: ['latin'], weight: ["500"], style: ["normal"] });

export default function Home() {
  const [inputData, setInputData] = useState('asdf \n dsf');
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(event.target.value);
  };

  const handleSubmit = () => {

  }
  return (
    <div className="overflow-hidden h-screen flex flex-col items-center">
      <div className={`${space500.className} text-3xl`} style={{ marginTop: '5vh' }}>FrameGPT</div>
      <div className={`${space500.className} text-2xl`} style={{ marginTop: '5px' }}>Make a frame that mints a Base NFT</div>
      <div className="w-1/4 h-8 rounded mt-5 border-2 flex" style={{ borderColor: '#7c65c1' }}>
        <div className="w-1/2 h-full border-r-2 flex flex-col justify-center" style={{ backgroundColor: '#7c65c1', borderColor: '#7c65c1' }}>
          <div className={`${space500.className} text-md text-center text-white`}>Make a Frame</div>
        </div>
        <div className="w-1/2 h-full border-r-2 flex flex-col justify-center">
          <div className={`${space500.className} text-md text-center`} style={{ color: '#7c65c1' }}>Ask AI Docs</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div>enter data</div>
        <textarea className="multiline-placeholder" value={inputData} onChange={handleChange}></textarea>
        <div className="w-36 h-8 rounded mt-5 flex flex-col justify-center" style={{ backgroundColor: '#7c65c1' }}>
          <div className=" flex flex-col justify-center">
            <button type="submit" className={`${space500.className} text-md text-center text-white`}>✨ Generate ✨</button>
          </div>
        </div>
      </form>
    </div>
  );
}
