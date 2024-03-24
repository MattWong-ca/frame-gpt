"use client";
import Image from "next/image";
import { Space_Grotesk } from 'next/font/google'
import { ChangeEvent, useState } from "react";
import './globals.css';
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

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
export default function Home() {
  const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


  async function test() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "Who is Tom Brady?" }],
      model: "gpt-3.5-turbo",
    });
  
    console.log(completion.choices[0]);
  }
  test();


  const placeholder = 'Frame Name: Just build it.\n\n--Frame One--\nTitle: Mint Page\nImage URL: https://cloudflare-ipfs.com/ipfs/QmUYMKFHqwxyX6LpZyGT7LMcDmo7SdoKmrQVXvPa8zkk9k\nImage ratio: 1:1\nButtons:\n1. "Mint", uses this contract: 0xb0d94258bcee18c3fcfbd6b0ac336cdf4e2b67a9';
  const [inputData, setInputData] = useState(placeholder);
  const [isMakeFrame, setIsMakeFrame] = useState(true);
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(inputData);
  }

  
  // const anthropic = new Anthropic();

// async function test() {
//   const message = await anthropic.messages.create({
//     model: 'claude-3-opus-20240229',
//     max_tokens: 1024,
//     messages: [
//       {"role": "user", "content": "Who is Tom Brady?"}
//     ]
//   });
//   console.log(message);
// };
// test();

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
