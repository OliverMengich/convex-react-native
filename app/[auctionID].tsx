import { Dimensions, Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useState } from 'react'
import {Image} from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import ModalWindow from '@/components/shared/modal'
import { useColorScheme } from '@/hooks/use-color-scheme.web'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import LineDisplay from '@/components/shared/LinearDisplay'
import ColumnDisplay from '@/components/shared/column-display'
import CustomTextInput from '@/components/shared/CustomTextInput'
const { width} = Dimensions.get("screen")
export default function AuctionID() {
    const {auctionID}=useLocalSearchParams()
    const auction = useQuery(api.auctions.getAuction,{auctionId: auctionID as Id<"auctions">})
    const placeBidFc = useMutation(api.auctions.placeBid)
    const user = useQuery(api.users.viewer)
    const [newAuction,setNewAuction] = useState<{name:string,price:number }|null>({name:'',price:0})
    
    const theme = useColorScheme()
    const [showModal,setShowModal] = useState(false)
    const placeBidHandler = async ()=>{
        await placeBidFc({auctionId: auctionID as Id<"auctions">,bidderName: user?.name as string,bidderPrice: newAuction?.price as number})
    }
    return (
        <>
            <ModalWindow isVisible={showModal} isDarkMode={theme==='dark'} onClose={()=>setShowModal(!showModal)}>
                <View>
                    <Text style={{fontSize:30,textAlign:'center',marginVertical:10,fontFamily:'MontserratSemiBold',}}>Place Bid</Text>
                    <CustomTextInput
                        name='price'
                        color=''
                        keyboradType='numeric'
                        onChangeText={(_,v)=>{
                            if(auction && auction?.bids[0].price >= parseFloat(v)){
                                ToastAndroid.show('Your bid should be greater than the last bid',ToastAndroid.SHORT)
                                return
                            }
                            setNewAuction({...newAuction as unknown as any,price: parseFloat(v)})
                        }}
                        placeholder='e.g 2000'
                        title='Price'
                        value={newAuction?.price? newAuction?.price.toString() as unknown as any: 0}
                    />
                    <Text style={{fontSize:20,textAlign:'center',marginVertical:1,fontFamily:'MontserratSemiBold',}}>Select Images</Text>
                    <Pressable onPress={placeBidHandler} style={[styles.button,{borderRadius:40,width:'50%',alignSelf:'center', backgroundColor:theme==='dark'?'white':'black'}]}>
                        <Text style={{fontFamily:'MontserratBold',color: theme==='dark'?'black':'white'}}>PLACE BID</Text>
                    </Pressable>              
                </View>
            </ModalWindow>
            <View style={styles.container}>
                <LineDisplay
                    data={auction?.imagesUrl??[]}
                    isLoading={false}
                    keyExtractor={x=>x}
                    renderItem={({it})=>(
                        <Image
                            source={{uri:it}}
                            style={{width:width*.8,marginHorizontal:10,marginVertical:10, height:300,borderRadius:20}}
                        />
                    )}
                    loadingItem='advert'
                />
                <Text style={{color:'#000',fontFamily:'MontserratBold',marginVertical:10, fontSize:30}}>{auction?.product.name}</Text>
                <Text style={{color:'#000',fontFamily:'MontserratBold',marginVertical:10, fontSize:20}}>Start Price:{auction?.product.start_price}</Text>
                <View style={{borderTopWidth: StyleSheet.hairlineWidth,paddingVertical:10}}>
                    <Text style={{color:'#000',fontFamily:'MontserratBold',marginVertical:10, fontSize:30}}>Bids</Text>
                    <ColumnDisplay
                        data={auction?.bids??[]}
                        renderItem={({it})=>(
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View>
                                    <Text style={{color:'#000',fontFamily:'MontserratBold',marginVertical:10, fontSize:30}}>{it.bidderName}</Text>
                                    <Text style={{color:'#000',fontFamily:'MontserratBold',marginVertical:10, fontSize:20}}>{it.price}</Text>
                                </View>
                                {
                                    auction?.ownerId=== user?._id?(
                                        <Pressable style={{paddingVertical:5,backgroundColor:'#499dff', paddingHorizontal:10}}>
                                            <Text style={{color:'#fff',fontFamily:'MontserratMedium',marginVertical:10, fontSize:15}}>Accept Bid</Text>
                                        </Pressable>
                                    ):null
                                }
                            </View>
                        )}
                        callBackFc={async ()=>{}}
                        emptyComponent={(
                            <View style={{alignItems:'center', justifyContent:'center',marginTop:40}}>
                                <Image style={{height:100,width:100}} source={require('@/assets/images/auction.png')} />
                                <Text style={{textAlign:'center'}}>No bids placed.</Text>
                            </View>
                        )}
                        isLoading={false}
                        keyExtractor={it=>it.bidderName+(Math.floor(Math.random()*100))}
                        loadingItem='matatu'
                    />
                </View>
                <View style={{position:'absolute',bottom:0,flexDirection:'row',alignItems:'center',backgroundColor:'red'}}>
                    <Text style={{color:'#000',fontFamily:'MontserratBold',marginVertical:10, fontSize:30}}>Highest Bid: {auction?.bids[auction.bids.length-1].price}</Text>
                    {
                        auction?.ownerId!== user?._id?(
                            <Pressable style={{paddingVertical:5,backgroundColor:'#499dff', paddingHorizontal:10}} onPress={()=>setShowModal(!showModal)}>
                                <Text style={{color:'#fff',fontFamily:'MontserratMedium',marginVertical:10, fontSize:15}}>Place bid</Text>
                            </Pressable>
                        ):null
                    }
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    button:{
        borderWidth: .5,
        borderRadius: 40,
        paddingHorizontal:5,
        paddingVertical:10,
        width: '45%',
        marginHorizontal:10,
        justifyContent:'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection:'row',
        alignItems:'center'
    },
})