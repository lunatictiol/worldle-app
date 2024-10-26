import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import { Stack, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import OnScreenKeyboard from '@/components/OnScreenKeyBoard'
const ROWS  =6;

const game = () => {
  const colorScheme = useColorScheme()
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const gray = Colors[colorScheme ?? 'light'].gray;
  const router = useRouter()

  const [rows, setRows] = useState<string[][]>(new Array(ROWS).fill(new Array(5).fill('a'))) 
  const [curRow, setCurRow] = useState(0)
  const [curCol, setCurCol] = useState(0)
  const[greenLetters, setGreenLetters] = useState<string[]>([])
  const[grayLetters, setGrayLetters] = useState<string[]>([])
  const[yellowLetters, setYellowLetters] = useState<string[]>([])
  const addKey = (key:String)=>{
    console.log("add key",key);
    
  }
   
  return (
    <View style ={[styles.container,{backgroundColor:backgroundColor}]} >
      <Stack.Screen options={{
        headerRight:()=>(
          <View style = {styles.headerIcons}>
            <Ionicons name='help-circle-outline' size={28} color={textColor}/>
            <Ionicons name='podium-outline' size={28} color={textColor}/>
            <Ionicons name='settings-sharp' size={28} color={textColor}/>
          </View>
        )
      }} />
      <View style={styles.gameField}>
         {
          rows.map((row,rowIndex)=>(
            <View style={styles.gameFieldRow} key={`row-${rowIndex}`}>
              {row.map((cell,cellIndex)=>(
                <View style={styles.cell} key={`cell-${cellIndex}`}>
                  <Text style={styles.cellText}> {cell} </Text>
                </View>
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

export default game

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