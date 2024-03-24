// "use client";
// import Image from "next/image";
// import { Space_Grotesk } from 'next/font/google'
// import { ChangeEvent, useState } from "react";
// import OpenAI from "openai";

// const space500 = Space_Grotesk({ subsets: ['latin'], weight: ["500"], style: ["normal"] });
// const space400 = Space_Grotesk({ subsets: ['latin'], weight: ["400"], style: ["normal"] });

// export default function Page() {


//   async function test() {
//     const options = {
//       method: 'POST',
//       headers: {
//         accept: 'application/json',
//         api_key: 'NEYNAR_API_DOCS',
//         'content-type': 'application/json'
//       },
//       body: JSON.stringify({
//         "name": "Sample Frame",
//         "pages": [
//             {
//                 "uuid": "357854f5-1a17-478b-8dd4-4e196e29329f",
//                 "version": "vNext",
//                 "title": "One",
//                 "image": {
//                     "url": "https://cloudflare-ipfs.com/ipfs/QmajRLF79ZG3P1iq2WfY5H2SxbACqVZU6LxqLiQBEaWAP9",
//                     "aspect_ratio": "1:1"
//                 },
//                 "buttons": [
//                     {
//                         "title": "Next",
//                         "index": 1,
//                         "action_type": "post",
//                         "next_page": {
//                             "uuid": "fa2a06bf-963f-4204-a1a6-a3bad12efce0"
//                         }
//                     }
//                 ],
//                 "input": {
//                     "text": {
//                         "enabled": false
//                     }
//                 }
//             },
//             {
//                 "uuid": "fa2a06bf-963f-4204-a1a6-a3bad12efce0",
//                 "version": "vNext",
//                 "title": "Two",
//                 "image": {
//                     "url": "https://cloudflare-ipfs.com/ipfs/QmUYMKFHqwxyX6LpZyGT7LMcDmo7SdoKmrQVXvPa8zkk9k",
//                     "aspect_ratio": "1:1"
//                 },
//                 "buttons": [
//                     {
//                         "title": "Back",
//                         "index": 1,
//                         "action_type": "post",
//                         "next_page": {
//                             "uuid": "357854f5-1a17-478b-8dd4-4e196e29329f"
//                         }
//                     },
//                     {
//                         "title": "Mint",
//                         "index": 2,
//                         "action_type": "mint",
//                         "next_page": {
//                             "mint_url": "eip155:8453:0xb0d94258bcee18c3fcfbd6b0ac336cdf4e2b67a9:1"
//                         }
//                     }
//                 ],
//                 "input": {
//                     "text": {
//                         "enabled": false
//                     }
//                 }
//             }
//         ]
//     })
//     };
    
//     fetch('https://api.neynar.com/v2/farcaster/frame', options)
//       .then(response => response.json())
//       .then(response => console.log(response))
//       .catch(err => console.error(err));
//   }



//   return (
//     <div onClick={()=> test()}>hi</div>
//   );
// }
import { Space_Grotesk } from 'next/font/google'
import React, { useEffect, useState } from 'react';
const space500 = Space_Grotesk({ subsets: ['latin'], weight: ["500"], style: ["normal"] });

interface TypewriterProps {
    texts: string[];
    period: number;
  }
  const Typewriter: React.FC<TypewriterProps> = ({ texts, period }) => {
    const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentText = texts[index];
      if (!isDeleting) {
        setDisplayedText((prevText) =>
          prevText.length === currentText.length ? prevText : currentText.slice(0, prevText.length + 1)
        );
      } else {
        setDisplayedText((prevText) =>
          prevText.length === 0 ? '' : prevText.slice(0, prevText.length - 1)
        );
      }

      if (!isDeleting && displayedText === currentText) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }
    }, period);

    return () => clearInterval(interval);
  }, [displayedText, index, isDeleting, period, texts]);

  return (
    <span className={`${space500.className} typewriter text-2xl`} style={{ marginTop: '5px' }}>{displayedText}|</span>
  );
};

export default Typewriter;