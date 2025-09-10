import { StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import useDebounce from '@/utils/useDebounce';
interface SearchFilterProps {
    title: string;
    isDarkMode: boolean;
    conditions: {label:string,value:string}[]
    placeholder?: string;
    hideAutoCapitalization?: boolean;
    marginVertical?: number;
    callBackText: (text: string)=>void;
    onPress: (condition: string) => void;
    onTextInputPress?: ()=>void;
    additionalContainerStyle?: StyleProp<ViewStyle>
}
export default function SearchFilter({additionalContainerStyle,callBackText,hideAutoCapitalization,marginVertical,onTextInputPress,conditions,placeholder,onPress,isDarkMode,title}:SearchFilterProps) {
    const [open,setOpen] = useState(false);
    const [searchText, setSearchText] = React.useState<string>('');
    const debouncedValueSearch = useDebounce<string>(searchText,500);
    const onFilterPress = () => setOpen(!open);
    useEffect(()=>{
        callBackText(debouncedValueSearch);
    },[debouncedValueSearch,callBackText]);
    const onChangeText = (text: string)=>setSearchText(text);
    
    return (
        <View style={[{marginVertical:marginVertical !== undefined?marginVertical:10,},additionalContainerStyle]}>
            <Text style={[styles.boldText,{color:isDarkMode?'#fff':'#000'}]}>{title}</Text>
            <View style={styles.row}>
                <View style={[styles.searchContainer,{borderColor: '#ccc'}]}>
                    <Ionicons name="search" size={20} color='#919191' />
                    <TextInput autoCapitalize={hideAutoCapitalization?'words':'none'} onPress={onTextInputPress} placeholderTextColor='#919191' onChangeText={onChangeText} placeholder={placeholder?placeholder:""} style={{width:'100%',fontFamily:'MontserratRegular',color:isDarkMode?'#fff':'#000',}}/>
                </View>
                {conditions && conditions.length>0?(<Ionicons onPress={onFilterPress} name="filter" size={25} color={isDarkMode?'#fff':'#000'} />):null}
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    boldText:{
        fontFamily:'MontserratBold',
        fontSize:20
    },
    row:{
        position:'relative',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:'100%',
        marginVertical:10
    },
    searchContainer: {
        width:'90%',
        paddingLeft:10,
        flexDirection:'row',
        alignItems:'center',
        borderRadius:10,
        borderWidth:1,
    }
})