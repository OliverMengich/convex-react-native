import { Dimensions, StyleSheet, Text, Pressable,View, DimensionValue } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

interface Props{
    title: string,
    widthPassed?:DimensionValue
    value: string,
    color: string,
    onCalendarPress:()=>void,
}
export default function CustomDatePicker({onCalendarPress,color,widthPassed,title,value}:Props) {
    return (
        <View style={[styles.container,{borderColor:color, width: widthPassed??width * .95}]}>
            <Text style={{marginVertical:7,color,textTransform:'uppercase',fontFamily:'MontserratSemiBold',}}>{title}</Text>
            <Pressable onPress={onCalendarPress} style={{flexDirection:'row',padding:10,alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{color,fontFamily:'MontserratRegular',}}>{value?value:'click to set'}</Text>
                <MaterialCommunityIcons onPress={onCalendarPress} color={color} name='calendar' size={24} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    inputFocused: {
        borderColor: "#007BFF", // Change border color when active
    },
    container:{
        borderBottomWidth:1,
        marginVertical: 8,
        alignSelf:'center',
    },
    textInputStyle:{
		fontSize:20,
        width:'80%',
		color: 'black',
		// marginTop:4,
	},
})