import { Space_Grotesk } from 'next/font/google'
import OpenAI from "openai";

const space500 = Space_Grotesk({ subsets: ['latin'], weight: ["500"], style: ["normal"] });

export default function Page() {
    const openai = new OpenAI();
    return (
        <div>hik</div>
    );
}