import Link from "next/link";
import styles from "../posts/_styles/sidebar.module.css";


const Sidebar: React.FC = () => {
  return (
    <>
      <div className={styles.sidebar}>
        <ul>
          <Link href={`/admin/posts`} className={styles.link}>
          <li className={styles.list}>記事一覧</li>
          </Link>
          <Link href={`/admin/categories`} className={styles.link}>
            <li className={styles.list}>カテゴリー 一覧</li>
          </Link>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
