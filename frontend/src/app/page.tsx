import Image from "next/image";
import { Space_Grotesk } from 'next/font/google'

const space500 = Space_Grotesk({ subsets: ['latin'], weight: ["500"], style: ["normal"] });

export default function Home() {
  return (
    <div className="overflow-hidden h-screen">
      <div className={`${space500.className} flex justify-center text-3xl`} style={{ paddingTop: '5vh' }}>FrameGPT</div>
      <div className={`${space500.className} flex justify-center text-2xl`} style={{ paddingTop: '5px' }}>Make a frame that mints a Base NFT</div>
    </div>
  );
}
