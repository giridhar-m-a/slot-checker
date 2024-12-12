import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen items-center justify-between">
      <div className="mx-auto flex flex-col items-center p-24 min-h-[25vh] border-2 border-gray-200 rounded-lg shadow-xl">
        <div>
          <div className="text-xl px-14 py-4 bg-[#5f5fe1] font-bold text-white hover:text-gray-300 rounded-md hover:scale-105">
            <Link href="/participant/availability">
              Check Participant Availability
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
