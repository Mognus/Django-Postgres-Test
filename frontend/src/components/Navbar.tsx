import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full flex justify-between items-center bg-red-500">

          <div>
            <p> TestApp</p>
          </div>

            <div>
              <Link href="/markets">Märkte</Link>
              <Link href="/automaten">Automaten</Link>
            </div>

        </nav>
    );
}
