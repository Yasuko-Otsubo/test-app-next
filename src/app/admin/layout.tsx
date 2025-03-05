"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouteGuard } from "./_hooks/useRouteGuard";
import styles from "./posts/_styles/main.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard();

  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href);
  };
  return (
    <>
    <div className={styles.wrapper}>
      {/* サイドバー */}
      <aside className={styles.aside}>
        <Link
          href="/admin/posts"
          className={isSelected('/admin/posts') ? 'selected' : ''}
        >
          記事一覧
        </Link>
        <Link
          href="/admin/categories"
          className={isSelected('/admin/categories') ? 'selected' : ''}
        >
          カテゴリー一覧
        </Link>
      </aside>

      {/* メインエリア */}
      <div className="main">{children}</div>
      </div>
    </>
  )
}