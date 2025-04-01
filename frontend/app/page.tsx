import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-between">
      <div>
        <h1>Left</h1>
      </div>
      <div>
        <h1>Middle</h1>
      </div>
      <div>
        <h1>Right</h1>
      </div>
    </div>
  );
}
