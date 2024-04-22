"use client";
import { config } from 'dotenv';
config();
import { Space_Grotesk } from 'next/font/google'
import { ChangeEvent, useEffect, useState } from "react";
import './globals.css';
import OpenAI from "openai";
import Typewriter from '../../pages/typewriter';

const space500 = Space_Grotesk({ subsets: ['latin'], weight: ["500"], style: ["normal"] });
const space400 = Space_Grotesk({ subsets: ['latin'], weight: ["400"], style: ["normal"] });

const context = `
You're a chatbot that will help me parse human input into the proper JSON format needed for an API. Below is a JSON example of what I need given some human text. Please generate different UUIDs yourself for every different page. The "version" should always be "vNext". Aspect ratio can be 1:1 or 1.91:1. There can be up to 4 buttons, with indexes 1-4. If the button mints an NFT, the mint_url should be 'eip155:8453:<insertContractAddress>:1'. If it goes to another page, that page's UUID should be used. If it goes to a URL, then the redirect_url should be the URL given. Assume that input text is always false unless given, in which case use the given placeholder. 

When I send you another set of human text, please send back the JSON only without other text.

Human text example:
Frame Name: Frame Name
--Frame One--
Title: Page One
Image URL: https://cloudflare-ipfs.com/ipfs/QmajRLF79ZG3P1iq2WfY5H2SxbACqVZU6LxqLiQBEaWAP9
Image ratio: 1:1
Buttons:
1. Learn more, redirect to https://www.coinbase.com/
2. Next page, goes to Page 2

--Frame Two--
Title: Page 2
Image URL: https://cloudflare-ipfs.com/ipfs/QmUYMKFHqwxyX6LpZyGT7LMcDmo7SdoKmrQVXvPa8zkk9k
Aspect ratio: 1:1
Buttons:
1. Mint, use this contract: 0xb0d94258bcee18c3fcfbd6b0ac336cdf4e2b67a9
2. Learn more, link to https://www.coinbase.com/
3. Back, goes to Page One
4. Next, goes to Third Page

--Frame Three--
Name: Third Page
Image: https://cloudflare-ipfs.com/ipfs/QmeCYyYFBbRLeHtpQrAc7yrDoJL6QGnJ18ZQwENBCdwiJB
Aspect ratio: 1.91:1
Input text placeholder: Enter something...
Buttons:
1. Back, goes to Page 2
2. Home, goes to Page One

Here's the expected JSON for this example:
{
    name: 'Frame Name',
    pages: [
      {
        uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        version: 'vNext',
        title: 'Page One',
        image: {
          url: 'https://cloudflare-ipfs.com/ipfs/QmajRLF79ZG3P1iq2WfY5H2SxbACqVZU6LxqLiQBEaWAP9',
          aspect_ratio: '1:1'
        },
        buttons: [
          {
            title: 'Learn more',
            index: 1,
            action_type: 'post_redirect',
            next_page: {redirect_url: 'https://www.coinbase.com/'}
          },
          {
            action_type: 'post',
            next_page: {uuid: 'c051b0d1-5cb1-4aa3-8014-ee03838d6d3e'},
            title: 'Next page',
            index: 2
          }
        ],
        input: {text: {enabled: false}}
      },
      {
        version: 'vNext',
        image: {
          aspect_ratio: '1:1',
          url: 'https://cloudflare-ipfs.com/ipfs/QmUYMKFHqwxyX6LpZyGT7LMcDmo7SdoKmrQVXvPa8zkk9k'
        },
        input: {text: {enabled: false}},
        uuid: 'c051b0d1-5cb1-4aa3-8014-ee03838d6d3e',
        title: 'Page 2',
        buttons: [
          {
            action_type: 'mint',
            next_page: {mint_url: 'eip155:8453:0xb0d94258bcee18c3fcfbd6b0ac336cdf4e2b67a9:1'},
            title: 'Mint',
            index: 1
          },
          {
            action_type: 'post_redirect',
            next_page: {redirect_url: 'https://www.coinbase.com/'},
            title: 'Learn more',
            index: 2
          },
          {
            action_type: 'post',
            next_page: {uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6'},
            title: 'Back',
            index: 3
          },
          {
            action_type: 'post',
            next_page: {uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'},
            title: 'Next',
            index: 4
          }
        ]
      },
      {
        version: 'vNext',
        image: {
          aspect_ratio: '1.91:1',
          url: 'https://cloudflare-ipfs.com/ipfs/QmeCYyYFBbRLeHtpQrAc7yrDoJL6QGnJ18ZQwENBCdwiJB'
        },
        input: {text: {enabled: true, placeholder: 'Enter something...'}},
        uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        title: 'Third page',
        buttons: [
          {
            action_type: 'post',
            next_page: {uuid: 'c051b0d1-5cb1-4aa3-8014-ee03838d6d3e'},
            title: 'Back',
            index: 1
          },
          {
            action_type: 'post',
            next_page: {uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6'},
            title: 'Home',
            index: 2
          }
        ]
      }
    ]
  }
`;

const placeholder = `Frame Name: Sample Frame

--Frame One--
Title: One
Image URL: https://cloudflare-ipfs.com/ipfs/QmajRLF79ZG3P1iq2WfY5H2SxbACqVZU6LxqLiQBEaWAP9
Image ratio: 1:1
Buttons:
1. Next, goes to Two

--Frame Two--
Title: Two
Image URL: https://cloudflare-ipfs.com/ipfs/QmUYMKFHqwxyX6LpZyGT7LMcDmo7SdoKmrQVXvPa8zkk9k
Image ratio: 1:1
Buttons:
1. Back, goes to One
2. Mint, uses this contract 0xb0d94258bcee18c3fcfbd6b0ac336cdf4e2b67a9`;

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
          <form onSubmit={() => {}} /* use handleSubmit */ className="flex flex-col items-center mt-6">
            <div className={`text-red-500 ${space400.className}`}>
              🚨 API key has been removed, explore the <a href={`https://github.com/MattWong-ca/frame-gpt`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>code</a> instead! 🚨
            </div>
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
