import React from "react";
import styles from "@/styles/layouts/_layout.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p>© {new Date().getFullYear()} Task Manager. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
