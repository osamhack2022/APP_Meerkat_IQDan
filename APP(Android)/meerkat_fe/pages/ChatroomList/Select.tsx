import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { useEffect, useState } from 'react';

type SelectProp = {
  allValues: string[];
  currValue: string;
  setCurrValue: Function;
  closeFlag: boolean;
};

// const sampleItems = [
//   { label: 'Apple', value: 'apple' },
//   { label: 'Banana', value: 'banana' },
// ];

export default function Select(props: SelectProp) {
  const { allValues, setCurrValue, closeFlag} = props;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(allValues[0]);
  const [items, setItems] = useState(
    allValues.map(val => {
      return { label: val, value: val };
    }),
  );

  useEffect(() => {
    setCurrValue(value)
  }, [value])

  useEffect(() => {
    setOpen(false)
  }, [closeFlag])
  

  return (
    <View style={{ marginRight: 20 }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        style={{
          minHeight: 30,
          flexDirection: 'row',
          width: 100,
          borderWidth: 1,
          padding: 5,
          alignContent: 'center',
        }}
      />
    </View>
  );
}
