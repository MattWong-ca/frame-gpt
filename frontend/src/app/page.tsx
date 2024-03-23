import Image from "next/image";
import { Space_Grotesk } from 'next/font/google'

const space500 = Space_Grotesk({ subsets: ['latin'], weight: ["500"], style: ["normal"] });

export default function Home() {
  return (
    <div className="overflow-hidden h-screen flex flex-col items-center">
      <div className={`${space500.className} text-3xl`} style={{ marginTop: '5vh' }}>FrameGPT</div>
      <div className={`${space500.className} text-2xl`} style={{ marginTop: '5px' }}>Make a frame that mints a Base NFT</div>
      <div className="w-1/4 h-8 rounded mt-5 border-2 flex" style={{ borderColor: '#7c65c1' }}>
        <div className="w-1/2 h-full border-r-2 flex flex-col justify-center" style={{ backgroundColor: '#7c65c1', borderColor: '#7c65c1' }}>
          <div className={`${space500.className} text-md text-center text-white`}>Make a Frame</div>
        </div>
        <div className="w-1/2 h-full border-r-2 flex flex-col justify-center">
          <div className={`${space500.className} text-md text-center`} style={{ color: '#7c65c1'}}>Ask AI Docs</div>
        </div>
      </div>
    </div>
  );
}
