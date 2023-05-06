import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "./MultiSelect.css";

interface Props {
  options: string[];
  onChange: (value: string[]) => void;
}

function MultiSelect({ options, onChange }: Props) {
  const [selectedList, setSelectedList] = useState<Array<string>>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    onChange(selectedList);
  }, [selectedList, onChange]);

  function handleSelect(option?: string) {
    setOpen(!open);
    if (option) {
      setSelectedList((selected) => selected.concat(option));
    }
  }

  function handleOpen() {
    setOpen(!open);
  }

  function handleRemoveItem(idx: number) {
    setSelectedList((selected) =>
      selected.slice(0, idx).concat(selected.slice(idx + 1))
    );
  }

  function updateOptions() {
    return options.filter((option) => !selectedList.includes(option));
  }

  const filtered = updateOptions();

  return (
    <div className="multi-select">
      <div className="select-input select-input-multiple">
        <div className="selected-list">
          {selectedList.length ? (
            selectedList.map((item, index) => (
              <div className="selected-item">
                <span key={index}>{item}</span>
                <span onClick={() => handleRemoveItem(index)}>
                  <FontAwesomeIcon className="remove-icon fa-solid" icon="x" />
                </span>
              </div>
            ))
          ) : (
            <div className="selected-item" onClick={handleOpen}>
              Select symbols
            </div>
          )}
          <div className="select-click" onClick={handleOpen} />
        </div>
      </div>

      {open ? (
        <div className="select-list">
          {filtered.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              className="select-item"
            >
              <FontAwesomeIcon
                className="select-icon fa-regular"
                icon="coins"
              />
              <span className="select-title">{item}</span>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default MultiSelect;
