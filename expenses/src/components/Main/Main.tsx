import { useEffect, useRef, useState, type Ref } from "react";
import styles from "./Main.module.css";
import { useOutsideClick } from "../../hooks/modalClose";
import { Filter } from "../Filter/Filter";

type listType = {
  id: number;
  date: string;
  store: string | null | string[];
  activity: string;
  price: number;
};

export const Main = () => {
  const [isActiveBtn, setIsActiveBtn] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [storeList, setStoreList] = useState<boolean>(false);
  const stores: string[] = [
    "Пятерочка",
    "Красное и Белое",
    "Озон",
    "AliExpress",
    "Магнит",
  ];
  const activities: string[] = [
    "Питание",
    "Хобби",
    "Развлечение",
    "Работа",
    "Машина",
    "Прочее",
  ];
  const dateInputRef: React.RefObject<HTMLInputElement | null> = useRef(null);
  const storeInputRef: React.RefObject<HTMLInputElement | null | string> =
    useRef(null);
  const priceInputRef: React.RefObject<HTMLInputElement | null | number> =
    useRef(null);
  const activityRef: React.RefObject<HTMLSelectElement | null> = useRef(null);
  const ulRef: Ref<HTMLUListElement | null> = useRef(null);

  const [edit, setEdit] = useState<null | listType>(null);
  const [newItem, setNewItem] = useState<listType>({
    id: 1,
    date: "",
    store: "",
    activity: "Питание",
    price: 0,
  });

  const listStorage: listType[] = [];

  const [list, setList] = useState<listType[]>(
    localStorage.getItem("purchases")
      ? JSON.parse(localStorage.getItem("purchases"))
      : listStorage
  );

  const allExpenses = (): number => {
    let total: number = 0;
    list.map((i) => (total = total + i.price));
    return total;
  };

  const selectStore = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (e.target instanceof HTMLElement) {
      setNewItem({
        ...newItem,
        store: e.target.textContent,
      });
    }
  };

  const saveEdittedlist = () => {
    setIsEdit(false);
  };

  const addNewItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (list) {
      setNewItem({ ...newItem, id: newItem.id + 1 });
    }
    if (
      newItem.date !== "" ||
      newItem.store !== "" ||
      newItem.price !== null ||
      newItem.activity !== ""
    ) {
      if (storeInputRef.current !== null) {
        storeInputRef.current.value = "";
      }
      setList([...list, newItem]);
      localStorage.setItem("purchases", JSON.stringify(list));
    }
  };

  const closeHintStore = () => {
    setStoreList(false);
  };

  useEffect(() => {
    if (
      newItem.date === "" ||
      newItem.store === "" ||
      newItem.price === null ||
      newItem.activity === ""
    ) {
      setIsActiveBtn(true);
    } else {
      setIsActiveBtn(false);
    }
  }, [newItem]);

  const editItem = (e: listType) => {
    setIsEdit(true);
    setEdit(e);
    if (dateInputRef.current !== null) {
      dateInputRef.current.value = e.date;
    }
    if (storeInputRef.current !== null) {
      storeInputRef.current.value = e.store;
    }
    if (activityRef.current !== null) {
      activityRef.current.value = e.activity;
    }
    if (priceInputRef.current !== null) {
      priceInputRef.current.value = e.price;
    }
  };

  const deleteItem = (e: listType) => {
    setList(list.filter((i) => i !== e));
    localStorage.setItem("purchases", JSON.stringify(list));
  };

  useOutsideClick(ulRef, closeHintStore);

  return (
    <>
      <div className={styles.main}>
        <Filter />
        <form onSubmit={addNewItem} className={styles.form} action="">
          <div className={styles.content}>
            <div className={styles.inputData}>
              <div>
                <p>Дата</p>
                <input
                  ref={dateInputRef}
                  className={styles.item}
                  onChange={(e) =>
                    isEdit
                      ? setNewItem({ ...newItem, date: edit.date })
                      : setNewItem({ ...newItem, date: e.target.value })
                  }
                  type="date"
                />
              </div>
              <div>
                <p>Магазин</p>
                <input
                  onDoubleClick={() => setStoreList(true)}
                  ref={storeInputRef}
                  defaultValue={newItem.store}
                  onFocus={() => setStoreList(true)}
                  className={storeList ? styles.itemActive : styles.item}
                  onChange={(e) =>
                    setNewItem({ ...newItem, store: e.target.value })
                  }
                  type="text"
                />
                {storeList && (
                  <ul className={styles.storeList} ref={ulRef}>
                    {stores.map((i) => (
                      <li
                        onClick={selectStore}
                        key={i}
                        className={styles.storeItem}
                      >
                        {i}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <p>Предназначение</p>
                <select
                  className={styles.selectItem}
                  ref={activityRef}
                  defaultValue="Питание"
                  onChange={(e) =>
                    setNewItem({ ...newItem, activity: e.target.value })
                  }
                >
                  {activities.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p>Цена</p>
                <input
                  ref={priceInputRef}
                  type="number"
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: Number(e.target.value) })
                  }
                  className={styles.item}
                />
              </div>
            </div>
            {isEdit ? (
              <button onClick={saveEdittedlist} className={styles.btn}>
                Сохранить
              </button>
            ) : (
              <button
                disabled={isActiveBtn ? true : false}
                type="submit"
                className={isActiveBtn ? styles.disableBtn : styles.btn}
              >
                Добавить
              </button>
            )}
          </div>
        </form>
        <div className={styles.list}>
          <div className={styles.listNames}>
            <div>Дата</div>
            <div>Магазин</div>
            <div>Цель</div>
            <div className={styles.priceName}>Цена, </div>
          </div>
          {list.map((i) => {
            return (
              <div
                className={
                  edit === i ? styles.listHeadEditing : styles.listHead
                }
                key={i.id}
              >
                <div>{i.date}</div>
                <div>{i.store}</div>
                <div>{i.activity}</div>
                <div>{i.price}</div>
                <div>
                  <button
                    onClick={() => editItem(i)}
                    className={styles.itemBtns}
                  >
                    🖊
                  </button>
                  <button
                    onClick={() => deleteItem(i)}
                    className={styles.itemBtns}
                  >
                    ❌
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.totalPrice}>Общий: {allExpenses()} </div>
      </div>
    </>
  );
};
