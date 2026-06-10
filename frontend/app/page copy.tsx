
import { Show, SignInButton, SignUpButton, SignOutButton, UserButton } from '@clerk/nextjs'
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <Show when="signed-out">
          <SignInButton forceRedirectUrl="/workspaces">
            <button >Sign in</button>
          </SignInButton>
          <SignUpButton forceRedirectUrl="/workspaces">
            <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
          <SignOutButton />
        </Show>
      </header>
      <Link href='/home'>
        <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
          to n2n2
        </button>
      </Link>
      Landing Page
    </div>
  );
}
