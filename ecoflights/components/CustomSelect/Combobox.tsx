import React from 'react';

// Lightweight Combobox implementation extracted for import from './Combobox'
export type Airport = { name: string; iata: string };

interface ComboboxContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  listData: Airport[];
  onSelect?: (iata: string) => void;
}

const ComboboxContext = React.createContext<ComboboxContextProps>({} as ComboboxContextProps);

interface ComboboxProps {
  children: React.ReactNode;
  listData: Airport[];
  initialValue?: string;
  onSelect?: (iata: string) => void;
  label?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({ children, listData, initialValue = '', onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState(initialValue);

  React.useEffect(() => {
    if (isOpen) {
      const close = () => setIsOpen(false);
      window.addEventListener('click', close);
      return () => window.removeEventListener('click', close);
    }
  }, [isOpen]);

  // call onSelect when selection changes
  React.useEffect(() => {
    if (onSelect && selectedItem) onSelect(selectedItem);
  }, [selectedItem, onSelect]);

  const value = React.useMemo(
    () => ({ isOpen, setIsOpen, selectedItem, setSelectedItem, searchTerm, setSearchTerm, listData, onSelect }),
    [isOpen, selectedItem, searchTerm, listData, onSelect]
  );

  return <ComboboxContext.Provider value={value}>{children}</ComboboxContext.Provider>;
};

export const useComboboxContext = () => React.useContext(ComboboxContext);

interface ComboboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const ComboboxInput: React.FC<ComboboxInputProps> = ({ children, className, ...props }) => {
  const { setIsOpen, searchTerm, selectedItem, setSelectedItem, setSearchTerm } = useComboboxContext();
  const refForId = React.useRef(Math.random().toString());

  return (
    <>
      <label htmlFor={refForId.current}>Enter Airport name or IATA code:</label>
      <div>
        <input
          {...props}
          id={refForId.current}
          value={selectedItem || searchTerm}
          onChange={(e) => {
            const { value } = e.target;
            setSearchTerm(value);
            setSelectedItem('');
            setIsOpen(true);
          }}
          className={["combobox-input", className].filter(Boolean).join(' ')}
          onClick={() => setIsOpen(true)}
        />
        {children}
      </div>
    </>
  );
};

export const ComboboxPopOver: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  const { isOpen } = useComboboxContext();
  if (!isOpen) return null;
  return (
    <div {...props} className={["combobox-popover", className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
};

export const ComboboxList: React.FC = () => {
  const { listData, searchTerm, setSearchTerm, setSelectedItem } = useComboboxContext();

  const filtered = React.useMemo(() => {
    if (!searchTerm) return listData;
    const input = searchTerm.toLowerCase().trim();
    return listData.filter(a => a.name.toLowerCase().includes(input) || a.iata.toLowerCase().includes(input));
  }, [listData, searchTerm]);

  return (
    <ul className="combobox-list">
      {filtered.map(item => (
        <li
          key={item.iata}
          onClick={() => {
            setSearchTerm('');
            setSelectedItem(item.iata);
          }}
          className="combobox-list-item"
        >
          {item.name} ({item.iata})
        </li>
      ))}
    </ul>
  );
};

export default Combobox;
