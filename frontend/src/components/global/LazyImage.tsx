import { useState } from "react";

interface Props {
  src: string;
  alt: string;
}

export default function LazyImage({ src, alt, ...props }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <img
      {...props}
      src={isLoaded ? src : '/placeholder.svg'}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      className={`transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};