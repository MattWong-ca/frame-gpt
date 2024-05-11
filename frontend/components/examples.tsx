import React from 'react';
import '../src/app/globals.css';
import { Space_Grotesk } from 'next/font/google';

const space400 = Space_Grotesk({ subsets: ['latin'], weight: ["400"], style: ["normal"] });

const ExampleFrames = () => {
    return (
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
    );
}

export default ExampleFrames;