import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "4 Square Architects ERP",
  description: "Construction & Architecture Management ERP System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#f97316",
                fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
                borderRadius: 12,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
