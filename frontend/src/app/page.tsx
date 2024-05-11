"use client";
import { config } from 'dotenv';
config();
import { Space_Grotesk } from 'next/font/google'
import { ChangeEvent, useEffect, useState } from "react";
import './globals.css';
import OpenAI from "openai";
import Typewriter from '../../pages/typewriter';
import { context, placeholder } from '../../data/prompts';

const space500 = Space_Grotesk({ subsets: ['latin'], weight: ["500"], style: ["normal"] });
const space400 = Space_Grotesk({ subsets: ['latin'], weight: ["400"], style: ["normal"] });

export default function Home() {
  const [openAILoading, setOpenAILoading] = useState(false);
  const [neynarLoading, setNeynarLoading] = useState(false);
  const [openAIResponse, setOpenAIResponse] = useState<string | null>(null);
  const [inputData, setInputData] = useState(placeholder);
  const [isMakeFrame, setIsMakeFrame] = useState(true);
  const [neynarLink, setNeynarLink] = useState()
  const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

  async function fetchDataFromOpenAI() {
    setOpenAILoading(true);
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: context + `\nMake me a JSON for this:\n${inputData}` }],
      model: "gpt-3.5-turbo",
    });
    console.log(completion.choices[0].message.content);
    setOpenAIResponse(completion.choices[0].message.content);
  }
  async function fetchNeynarData() {
    setNeynarLoading(true);
    setOpenAILoading(false);
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY!,
        'content-type': 'application/json'
      },
      body: openAIResponse
    };
    fetch('https://api.neynar.com/v2/farcaster/frame', options)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setNeynarLink(response.link);
      })
      .catch(err => console.error(err));
  }
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(event.target.value);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetchDataFromOpenAI();
  }
  useEffect(() => {
    if (openAIResponse) {
      fetchNeynarData();
      setNeynarLoading(false);
    }
  }, [openAIResponse]);
  return (
    <div className="overflow-hidden h-screen flex flex-col items-center">
      <div className={`${space500.className} text-3xl`} style={{ marginTop: '5vh' }}>FrameGPT</div>
      <Typewriter
        texts={["Make a frame that mints a Base NFT", "Make a gallery of photos", "Build an onchain checkout flow"]}
        period={150}
      />
      <div className="w-80 h-8 rounded mt-5 border-2 flex" style={{ borderColor: '#7c65c1' }}>
        <div className="w-1/2 h-full border-r-2 flex flex-col justify-center" style={{ backgroundColor: isMakeFrame ? '#7c65c1' : 'white', borderColor: '#7c65c1' }}>
          <div onClick={() => setIsMakeFrame(true)} className={`${space500.className} text-md text-center text-white`} style={{ color: isMakeFrame ? 'white' : '#7c65c1' }}>Make a Frame</div>
        </div>
        <div className="w-1/2 h-full flex flex-col justify-center" style={{ backgroundColor: isMakeFrame ? 'white' : '#7c65c1' }}>
          <div onClick={() => setIsMakeFrame(false)} className={`${space500.className} text-md text-center`} style={{ color: isMakeFrame ? '#7c65c1' : 'white' }}>Examples</div>
        </div>
      </div>
      {isMakeFrame ? (
        <>
          <form onSubmit={() => { handleSubmit }} className="flex flex-col items-center mt-6">
            <div className={`${space400.className}`}>~ The input below works as is, hit Generate to try it out! ~</div>
            <textarea className={`${space400.className} rounded border border-gray-300 w-full h-96 p-2 overflow-x-auto`} style={{ whiteSpace: 'nowrap' }} value={inputData} onChange={handleChange}></textarea>
            {openAILoading || neynarLoading ? (
              <div className="loader mt-5"></div>
            ) : (
              <div className="w-36 h-8 rounded mt-5 flex flex-col justify-center" style={{ backgroundColor: '#7c65c1' }}>
                <div className=" flex flex-col justify-center">
                  <button className={`${space500.className} text-md text-center text-white`}>✨ Generate ✨</button>
                </div>
              </div>
            )}
          </form>
          {neynarLink &&
            <a href={`https://warpcast.com/~/developers/frames?url=${neynarLink}`} target="_blank" rel="noopener noreferrer">
              <div className={`${space400.className} text-2xl mt-6`} style={{ textDecoration: 'underline', color: 'blue' }}>{neynarLink}</div>
            </a>
          }
        </>
      ) : (
        <div className={`${space400.className} flex flex-col items-center mt-6 overflow-y-auto`}>
          <div className={`${space400.className} rounded border p-2 pb-10 overflow-x-auto`} style={{ width: '450px', whiteSpace: 'nowrap' }}>
            ️💰 One Page Mint ️💰
            <br></br>
            <br></br>
            Frame Name: Sample Mint
            <br></br>
            Title: Page One
            <br></br>
            Image URL: https://cloudflare-ipfs.com/ipfs/QmajRLF79ZG3P1iq2WfY5H2SxbACqVZU6LxqLiQBEaWAP9
            <br></br>
            Image ratio: 1:1
            <br></br>
            Buttons:
            <br></br>
            1. Mint, uses this contract: 0xb0d94258bcee18c3fcfbd6b0ac336cdf4e2b67a9
            <br></br>
            <br></br>
            <br></br>
            🖼️ Multi-frame, multi-options 🖼️
            <br></br>
            <br></br>
            Frame Name: Frame Name
            <br></br>
            <br></br>
            --Frame One--
            <br></br>
            Title: Page One
            <br></br>
            Image URL: https://cloudflare-ipfs.com/ipfs/QmajRLF79ZG3P1iq2WfY5H2SxbACqVZU6LxqLiQBEaWAP9
            <br></br>
            Image ratio: 1:1
            <br></br>
            Buttons:
            <br></br>
            1. Learn more, redirect to https://www.coinbase.com/
            <br></br>
            2. Next page, goes to Page 2
            <br></br>
            <br></br>
            --Frame Two--
            <br></br>
            Title: Page 2
            <br></br>
            Image URL: https://cloudflare-ipfs.com/ipfs/QmUYMKFHqwxyX6LpZyGT7LMcDmo7SdoKmrQVXvPa8zkk9k
            <br></br>
            Aspect ratio: 1:1
            <br></br>
            Buttons:
            <br></br>
            1. Mint, use this contract: 0xb0d94258bcee18c3fcfbd6b0ac336cdf4e2b67a9
            <br></br>
            2. Learn more, link to https://www.coinbase.com/
            <br></br>
            3. Back, goes to Page One
            <br></br>
            4. Next, goes to Third Page
            <br></br>
            <br></br>
            --Frame Three--
            <br></br>
            Name: Third Page
            <br></br>
            Image: https://cloudflare-ipfs.com/ipfs/QmeCYyYFBbRLeHtpQrAc7yrDoJL6QGnJ18ZQwENBCdwiJB
            <br></br>
            Aspect ratio: 1.91:1
            <br></br>
            Input text placeholder: Enter something...
            <br></br>
            Buttons:
            <br></br>
            1. Back, goes to Page 2
            <br></br>
            2. Home, goes to Page One
          </div>
        </div>
      )}
    </div>
  );
}
