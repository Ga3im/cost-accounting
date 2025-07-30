import { useEffect, useRef, useState, type Ref } from "react";
import styles from "./Main.module.css";
import { useOutsideClick } from "../../hooks/modalClose";
import { Filter } from "../Filter/Filter";

type listType = {
  id: Date | null;
  date: string;
  store: string | null | string[];
  activity: string;
  price: number;
};

export const Main = () => {
  const [isActiveBtn, setIsActiveBtn] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<listType[] | null>(null);
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
    id: new Date(),
    date: "",
    store: "",
    activity: "Питание",
    price: 0,
  });

  useEffect(() => {
    list.map((i) => {
      i.store?.includes(search);
      setFilter(i);
    });
    console.log(filter);
  }, [search]);

  useEffect(() => {
    if (
      newItem.date === "" ||
      newItem.store === "" ||
      newItem.price === 0 ||
      newItem.activity === ""
    ) {
      setIsActiveBtn(true);
    } else {
      setIsActiveBtn(false);
    }
  }, [newItem]);

  const updateList = (newList: listType[]) => {
    setList(newList);
    localStorage.setItem("purchases", JSON.stringify(newList));
  };

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
    setStoreList(false);
  };

  const saveEdittedlist = () => {
    setIsEdit(false);
    list.map((i) => (i === edit ? (i = edit) : i));
  };

  const addNewItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      newItem.date !== "" ||
      newItem.store !== "" ||
      newItem.price !== null ||
      newItem.activity !== ""
    ) {
      if (dateInputRef.current !== null) {
        dateInputRef.current.value = "";
      }
      if (storeInputRef.current !== null) {
        storeInputRef.current.value = "";
      }
      if (priceInputRef.current !== null) {
        priceInputRef.current.value = "";
      }

      updateList([...list, newItem]);

      setNewItem({ ...newItem, id: new Date(), date: "", store: "", price: 0 });
      console.log(newItem);
    }
  };

  const closeHintStore = () => {
    setStoreList(false);
  };

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

  const cancelEditting = () => {
    setIsEdit(false);
    setEdit(null);
  };

  const deleteItem = (e: listType) => {
    updateList(list.filter((i) => i !== e));
  };

  useOutsideClick(ulRef, closeHintStore);

  return (
    <>
      <div className={styles.main}>
        <Filter setSearch={setSearch} />
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
                  placeholder="Магазин"
                  onDoubleClick={() => setStoreList(true)}
                  value={newItem.store}
                  ref={storeInputRef}
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
                <p>Цена, &#8381;</p>
                <input
                  placeholder="1 000 &#8381;"
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
              <div className={styles.buttonsContent}>
                <button onClick={saveEdittedlist} className={styles.btn}>
                  Сохранить
                </button>
                <button onClick={cancelEditting} className={styles.btnCancel}>
                  Отменить
                </button>
              </div>
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
            <div>Для чего</div>
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
                <div>{i.price.toLocaleString()}</div>
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
