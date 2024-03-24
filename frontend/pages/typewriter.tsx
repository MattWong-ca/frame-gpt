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