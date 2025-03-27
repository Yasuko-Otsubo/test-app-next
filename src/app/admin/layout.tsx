"use client";

import Sidebar from "../_components/Sidebar";
import styles from "./posts/_styles/main.module.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className={styles.wrapper}>
          <Sidebar />
          <div className={styles.main}>{children}</div>
        </div>
      </body>
    </html>
  );
}
