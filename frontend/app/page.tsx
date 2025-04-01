import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <Link href="/notes">Notes</Link>
      <br />
      <Link href="/studytools">Studytools</Link>
    </div>
  );
}
