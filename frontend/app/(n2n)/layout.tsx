import Navbar from "@/components/Navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <div className="h-screen w-screen overflow-hidden bg-[var(--app-bg-color)] flex">
            <Navbar />
           
            {children}
        </div>

    );
}
