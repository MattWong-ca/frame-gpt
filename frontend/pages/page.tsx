"use client";
import Image from "next/image";
import { Space_Grotesk } from 'next/font/google'
import { ChangeEvent, useState } from "react";
import OpenAI from "openai";

const space500 = Space_Grotesk({ subsets: ['latin'], weight: ["500"], style: ["normal"] });
const space400 = Space_Grotesk({ subsets: ['latin'], weight: ["400"], style: ["normal"] });

export default function Page() {
  const openai = new OpenAI();


  async function test() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });
  
    console.log(completion.choices[0]);
  }
  test();



  return (
    <div>hi</div>
  );
}
