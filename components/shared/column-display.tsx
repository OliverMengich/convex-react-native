import { DimensionValue, FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import React, { useEffect, JSX, } from 'react'
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated'
type LoadingItem =  "matatu" | "advert" | "package" | "route" | "user" | "transaction" | "institution"
interface Props<T>{
    data: T[]
    flatListheight?:DimensionValue,
    hideFlatlistScroll?: boolean
    isLoading:boolean
    loadingItem: LoadingItem
    isDarkMode?:boolean
    callBackFc: ()=>Promise<void>
    width?: DimensionValue
    keyExtractor:(item:T)=>string
    renderItem:({it}:{it:T})=>JSX.Element;
    emptyComponent: React.ReactNode
}
const duration = 800;
interface LoaderProps{
    isDarkMode?:boolean
    loadingItem?: LoadingItem
    width?: DimensionValue
}
function MatatuLoader({isDarkMode,width}: LoaderProps){
    const opacity= useSharedValue(0);
    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration}),
                withTiming(0, { duration })
            ),-1,true
        );
    }, [opacity]);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));
    return(
        <View style={[styles.item,{width: width?width:180}]}>
            <Animated.View style={[styles.bigbox,animatedStyle,{backgroundColor:isDarkMode?'#f5f5f5':'#B3B3B3'}]}/>
            <View style={{padding:7}}>
                <Animated.View style={[styles.smallbox,animatedStyle,{backgroundColor:isDarkMode?'#f5f5f5':'#B3B3B3'}]}/>
                <Animated.View style={[styles.smallbox2,,animatedStyle,{backgroundColor:isDarkMode?'#f5f5f5':'#B3B3B3'}]}/>
            </View>
        </View>
    )
}
function PackageLoader({isDarkMode,loadingItem,width}: LoaderProps){
    const opacity= useSharedValue(0);
    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration}),
                withTiming(0, { duration })
            ),-1,true
        );
    }, [opacity]);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));
    return(
        <View style={[styles.item,{width: width?width:180}]}>
            <View style={{padding:7}}>
                <Animated.View style={[styles.smallbox,animatedStyle,{backgroundColor:isDarkMode?'#f5f5f5':'#B3B3B3'}]}/>
                <Animated.View style={[styles.smallbox2,,animatedStyle,{backgroundColor:isDarkMode?'#f5f5f5':'#B3B3B3'}]}/>
            </View>
            <View style={{padding:7}}>
                <Animated.View style={[styles.smallbox2,animatedStyle,{backgroundColor:isDarkMode?'#f5f5f5':'#B3B3B3'}]}/>
                <Animated.View style={[styles.smallbox,animatedStyle,{backgroundColor:isDarkMode?'#f5f5f5':'#B3B3B3'}]}/>
            </View>
        </View>
    )
}
const LoaderItems={
    "matatu":MatatuLoader,
    "institution":MatatuLoader,
    "package":PackageLoader,
    "advert": PackageLoader,
    "route": PackageLoader,
    "user": PackageLoader,
    "transaction": PackageLoader
}
export default function ColumnDisplay<T>({data,emptyComponent,isLoading,hideFlatlistScroll,width,isDarkMode,loadingItem,flatListheight, callBackFc,renderItem,keyExtractor}:Props<T>) {
    const LoaderComponent = LoaderItems[loadingItem];
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async() => {
        setRefreshing(true);
        await callBackFc();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, [callBackFc]);
    return (
        <View style={{height:flatListheight}}>
            {
                isLoading ? (
                    <FlatList
                        data={[1,2,3,4,5,6,7,8]}
                        numColumns={2}
                        scrollEnabled={hideFlatlistScroll?false:true}
                        renderItem={({item})=>(
                            <LoaderComponent    
                                width={width}
                                key={item.toString()}
                                isDarkMode={isDarkMode}
                            />
                        )}
                        keyExtractor={(item)=>item.toString()}
                    />
                ) : data && data.length===0?
                    emptyComponent
                :(
                    <FlatList
                        numColumns={2}
                        data={data}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        scrollEnabled={hideFlatlistScroll?false:true}
                        renderItem={({ item }) => renderItem({it:item})}
                        keyExtractor={keyExtractor}
                    />
                )
            }
        </View>
    )
}


const styles = StyleSheet.create({
    item:{
        height:200,
        borderRadius:10,
        borderWidth:.5,
        borderColor:'#B3B3B3',
        margin:5
    },
    lineItem:{
        // height:30,
        margin:5,
        padding:5,
        width:100,
        borderRadius:10,
        borderWidth:.5,
        borderColor:'#B3B3B3',
    },
    bigbox:{
        width:'100%',
        height:'60%',
        borderTopLeftRadius:10
        ,borderTopRightRadius:10,
    },
    smallbox:{
        width:'80%',
        marginVertical:8, 
        height:13,
        borderRadius:15,
    },
    smallbox2:{
        width:'50%',
        marginVertical:8,
        height:10,
        borderRadius:5,
    }
})