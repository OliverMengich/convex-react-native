import {  View, Text,Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import SearchFilter from '@/components/shared/search-filter';
import { useColorScheme } from '@/hooks/use-color-scheme';
import TabsElements from '@/components/shared/tabs-elements';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ColumnDisplay from '@/components/shared/column-display';
import { Image } from 'expo-image';
import ModalWindow from '@/components/shared/modal';
import { useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import LineDisplay from '@/components/shared/LinearDisplay';
const {width} = Dimensions.get("screen")

const AucWindow = ({auctionId}:{auctionId?: Id<"auctions">})=>{
    const auction = useQuery(api.auctions.getAuction,{auctionId})
    if (!auction) {
        return
    }
    return (
        <View>
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
            <Text style={{color:'#000',fontFamily:'MontserratBold',marginVertical:10, fontSize:30}}>{auction.product.name}</Text>
            <Text style={{color:'#000',fontFamily:'MontserratBold',marginVertical:10, fontSize:30}}>Start Price:{auction.product.start_price}</Text>
            
        </View>
    )

}
export default function HomeScreen() {
    const auctions = useQuery(api.auctions.getAllAuctions)
    const theme = useColorScheme()
    const [isOpenModal,setIsOpenModal] = useState(false)
    const toggleModal = ()=>{
        setIsOpenModal(!isOpenModal)
        setSelectedAuction(null)
    }
    const [selectedAuction,setSelectedAuction] = useState<{auctionId: Id<"auctions">}|null>(null)
    console.log(auctions)
    
    return (
        <>
            <ModalWindow isVisible={isOpenModal} isDarkMode={theme==='dark'} onClose={toggleModal}>
                <AucWindow
                    auctionId={selectedAuction?.auctionId}
                />
            </ModalWindow>
            <ParallaxScrollView headerBackgroundColor={{ light: 'red', dark: '#1D3D47' }} >
                <SearchFilter 
                    callBackText={()=>{}}
                    isDarkMode={theme==='dark'}
                    additionalContainerStyle={{marginTop: 50}}
                    placeholder='Search auctions'
                    onPress={()=>{}}
                    conditions={[]}
                    title="All Auctions"
                />
                <TabsElements
                    activeTab={''}
                    isDarkMode={theme==='dark'}
                    tabElements={[
                        {id: '', name:'All',onPress:()=>{}},
                        {id: 'played', name:'Live Auctions',onPress:()=>{}},
                        {id: 'unplayed', name:'Ended Auctions',onPress:()=>{}},
                    ]}
                />
                <ColumnDisplay
                    data={auctions??[]}
                    callBackFc={async()=>{}}
                    isLoading={auctions===undefined}
                    keyExtractor={it=>it._id}
                    loadingItem='advert'
                    renderItem={({it})=>(
                        <View>
                            <Text>{it.ownerId}</Text>
                        </View>
                    )}
                    isDarkMode={theme==='dark'}
                    emptyComponent={
                        <View style={{alignItems:'center', justifyContent:'center',marginTop:40}}>
                            <Image style={{height:100,width:100}} source={require('@/assets/images/auction.png')} />
                            <Text style={{textAlign:'center'}}>No auctions</Text>
                        </View>
                    }
                />
            </ParallaxScrollView>
        </>
    );
}
