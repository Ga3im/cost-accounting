import { useState } from "react";
import s from "./Filter.module.css";

export const Filter = () => {
    const [error, setError] = useState(false)
  const searchButton = () => {};

  return (
    <>
      <form onSubmit={searchButton} className={s.form}>
        <div className={s.searchContent}>
          <input className={s.input} type="text" placeholder="Поиск" />
          <button type="submit" className={s.button}>
            🔎
          </button>
        </div>
        {error && <p className={s.errorMessage}>Ошибка</p>}
      </form>
    </>
  );
};
