import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-between">
      <div>
        <h1>Hello World</h1>
        <Link href="/notes">Notes</Link>
        <br />
        <Link href="/studytools">Studytools</Link>
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
