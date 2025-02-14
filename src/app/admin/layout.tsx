'use client'

import Sidebar from './_components/Sidebar';
import styles from './_styles/main.module.css';

export default function RootLayout({
  //`RootLayout`コンポーネント内にネストされた要素やコンポーネントを受け取るための特別なプロパティ
  children,
  //`children`が読み取り専用であることを示している
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang='ja'>
      <body>
        <div className={styles.wrapper}>
          <Sidebar />
          <div className={styles.main}>{children}</div>
        </div>
      </body>
    </html>
  )
}