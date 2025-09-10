import { StyleSheet,Image, Pressable, Text, View, DimensionValue, Platform } from 'react-native'
import React from 'react'

import { Id } from '@/convex/_generated/dataModel'
interface Props{
    it:{
        _id: Id<"products">;
        _creationTime: number;
        images: (string |null)[];
        name: string;
        start_price: number,
        userId: Id<"users">
    }
    onAuctionPressed?:(productId: Id<"products">)=>void
    isDarkMode: boolean
    width?: DimensionValue,
}
export default function ProductItem({it,isDarkMode,onAuctionPressed,width}: Props) {
    return (
        <View style={{overflow: Platform.OS==='android'?'hidden':'visible',borderRadius:10,width: width?width:'47%',margin:5,backgroundColor:isDarkMode?'#1f253b':'#c5c5c5', }}>
            <Pressable android_ripple={{color:'#ccc'}}>
                <View style={{backgroundColor:'#ccc',width:'100%',borderTopLeftRadius:10, borderTopRightRadius:10,height:130}}>
                    {
                        it.images[0]?(
                            <Image
                                source={{uri: it.images[0]}}
                                style={styles.imageStyle}
                            />
                        ):null
                    }
                </View>
                <View style={{ padding:10}}>
                    <Text style={[styles.numberPlate,{color:isDarkMode?'#fff':'#000',}]}>{it.name}</Text>
                    <Text style={[styles.seat,{color: isDarkMode?'#fff':'#000',}]}>Price: {it.start_price} </Text>
                    {
                        onAuctionPressed?(
                            <Pressable onPress={()=>onAuctionPressed(it._id)} style={styles.linkButton}> 
                                <Text style={{textAlign:'center',textTransform:'uppercase',color:'#fff'}}>AUCTION</Text>
                            </Pressable>
                        ):null
                    }
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    imageStyle:{
        width:'100%',
        resizeMode:'cover',
        borderTopRightRadius:10,
        backgroundColor:'#ccc',
        borderTopLeftRadius:10,
        height:'100%'
    },
    numberPlate:{
        fontWeight:'800',
        fontSize:20,
        marginVertical:6
    },
    seat:{
        fontSize:15,
        fontWeight:'300',
        marginBottom:6
    },
    linkButton:{
        alignSelf:'center',
        textAlign:'center',
        alignItems:'center',
        backgroundColor:'#499dff',
        paddingVertical:8,
        borderRadius:15,
        width:'70%'
    }
})