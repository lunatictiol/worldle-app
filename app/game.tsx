import { Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { allWords } from '@/utils/allWords';
import { words } from '@/utils/targetWords';
import { Stack, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import OnScreenKeyboard from '@/components/OnScreenKeyBoard'
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import SettingsModal from '@/components/SettingsModal';
import Animated, { ZoomIn } from 'react-native-reanimated';
const ROWS  =6;

const Page = () => {
  const colorScheme = useColorScheme()
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const gray = Colors[colorScheme ?? 'light'].gray;
  const router = useRouter()

  const [rows, setRows] = useState<string[][]>(new Array(ROWS).fill(new Array(5).fill(''))) 
  const [curRow, setCurRow] = useState(0)
  const [curCol, _setCurCol] = useState(0)
  
  const[greenLetters, setGreenLetters] = useState<string[]>([])
  const[grayLetters, setGrayLetters] = useState<string[]>([])
  const[yellowLetters, setYellowLetters] = useState<string[]>([])
  
  //const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const[word,setWord] = useState('sabiq') 
  const wordLetters = word.split('');
  
  const colStateRef = useRef(curCol)
  const setCurCol = (col:number)=>{
    colStateRef.current = col
    _setCurCol(col)
  }
  const settingsModalRef = useRef<BottomSheetModal>(null);

  const handlePresentSubscribeModalPress = () => settingsModalRef.current?.present()
  const addKey = (key:string)=>{
    const newRows = [...rows.map((row)=>[...row])]
    if (key === 'ENTER') {
      checkWord();
    } else if (key === 'BACKSPACE') {
      if (colStateRef.current === 0) {
        newRows[curRow][0] = '';
        setRows(newRows);
        return;
      }

      newRows[curRow][colStateRef.current - 1] = '';

      setCurCol(colStateRef.current - 1);
      setRows(newRows);
      return;
    } else if (colStateRef.current >= newRows[curRow].length) {
      // EoL don't add keys
    } else {
      console.log('addKey ~ curCol', colStateRef.current);

      newRows[curRow][colStateRef.current] = key;
      setRows(newRows);
      setCurCol(colStateRef.current + 1);
    }
    
  }
  const checkWord = ()=>{
    const currentWord = rows[curRow].join('');

    if (currentWord.length < word.length) {

      
    }

    if (!allWords.includes(currentWord)) {
      console.log('NOT A WORD');

      
    }


    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];

    currentWord.split('').forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newGreen.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellow.push(letter);
      } else {
        newGray.push(letter);
      }
    });

    setGreenLetters([...greenLetters, ...newGreen]);
    setYellowLetters([...yellowLetters, ...newYellow]);
    setGrayLetters([...grayLetters, ...newGray]);

    setTimeout(() => {
      if (currentWord === word) {
        console.log('🚀 ~ checkWord ~ WIN');
        router.push(`/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`)
        
      } else if (curRow + 1 >= rows.length) {
        console.log('GAME OVER');
        router.push(`/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`)
      }
    }, 1500);
    setCurRow(curRow + 1);
    setCurCol(0);
  }
    const getCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    'worklet';
    if (curRow > rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        return Colors.light.green;
      } else if (wordLetters.includes(cell)) {
        return Colors.light.yellow;
      } else {
        return gray;
      }
    }
    return 'transparent';
  };

  const getBorderColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex && cell !== '') {
      return getCellColor(cell, rowIndex, cellIndex);
    }
    return Colors.light.gray;
  };
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === 'Enter') {
        addKey("ENTER");
      } else if (e.key === 'Backspace') {
        addKey("BACKSPACE");
      } else if (e.key.length === 1) {
        addKey(e.key);
      }
    };

    if (Platform.OS === 'web') {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Don't forget to clean up
    return () => {
      if (Platform.OS === 'web') {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [curCol]);
   
  return (
    <View style ={[styles.container,{backgroundColor:backgroundColor}]} >
      <SettingsModal ref={settingsModalRef} />
      <Stack.Screen options={{
        headerRight:()=>(
          <View style = {styles.headerIcons}>
            <Ionicons name='help-circle-outline' size={28} color={textColor}/>
            <Ionicons name='podium-outline' size={28} color={textColor}/>
            <TouchableOpacity onPress={handlePresentSubscribeModalPress}>
                <Ionicons name="settings-sharp" size={24} color={textColor} />
              </TouchableOpacity>
          </View>
        )
      }} />
      <View style={styles.gameField}>
         {
          rows.map((row,rowIndex)=>(
            <View style={styles.gameFieldRow} key={`row-${rowIndex}`}>
              {row.map((cell,cellIndex)=>(
                <Animated.View 
                entering={ZoomIn.delay(cellIndex*55)}
                style={[styles.cell,{
                  backgroundColor:getCellColor(cell,rowIndex,cellIndex),
                  borderColor:getBorderColor(cell,rowIndex,cellIndex)
                }]} key={`cell-${cellIndex}`}>
                  <Text style={[styles.cellText,
                    {color:curRow>rowIndex ?"#fff":textColor}
                  ]}> {cell} </Text>
                </Animated.View>
              ))

              }

            </View>
          ))
         }
      </View>
      <OnScreenKeyboard onKeyPressed={addKey} grayLetters={grayLetters} greenLetters={greenLetters} yellowLetters={yellowLetters}/>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
  },
  gameField: {
    alignItems: 'center',
    gap: 8,
  },
  gameFieldRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    backgroundColor: '#fff',
    width: 62,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  cellText: {
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
})