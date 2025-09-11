import { StyleSheet, View, Text, FlatList, Dimensions,Pressable, Platform, ToastAndroid, Alert } from 'react-native';
import {Image} from 'expo-image'
import { useMutation, useQuery } from 'convex/react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import SearchFilter from '@/components/shared/search-filter';
import { api } from '@/convex/_generated/api';
import DateTimePicker from '@react-native-community/datetimepicker'
import ColumnDisplay from '@/components/shared/column-display';
import ModalWindow from '@/components/shared/modal';
import { useState } from 'react';
import CustomTextInput from '@/components/shared/CustomTextInput';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Id } from '@/convex/_generated/dataModel';
import ProductItem from '@/components/shared/product-item';
import OverlayLoading from '@/components/shared/overlay_loading';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import CustomDatePicker from '@/components/shared/custom-datepicker';
const {width} = Dimensions.get('screen')

export default function Products() {
    const backgroundColor = useThemeColor({}, 'background');
    const router = useRouter();
    
    const products = useQuery(api.products.getAllProducts)
    const user = useQuery(api.users.viewer)
    const generateUploadUrl = useMutation(api.products.generateUploadUrl)
    const createNewProduct = useMutation(api.products.createProduct)
    const createNewAuction = useMutation(api.auctions.createAuction)
    
    const theme = useColorScheme()
    const [isOpenModal,setIsOpenModal] = useState<{category:'new_product'|'view_product'}|null>(null)
    const [isLoading,setIsLoading] = useState(false)
    const [selectedProduct,setSelectedProduct] = useState<Product | null>(null)
    const [toggle, setToggle] = useState(false);
    
    const newProductHandler = async (newProduct: {name:string,start_price:number ,images: {uri:string,type: string}[]})=>{
        if (!newProduct || !newProduct.name || !newProduct.start_price) {
            ToastAndroid.show('Please fill all details',ToastAndroid.SHORT)
            return
        }
        setIsOpenModal(null)
        setIsLoading(true)
        console.log(newProduct.images)
        try {
            const storageIds = await Promise.all(newProduct.images.map(async img=>{
                const postUrl = await generateUploadUrl();
                console.log(postUrl)
                // 2. Get the file from the URI pointing to a local file
                const fileData = await fetch(img.uri);
                // Basic error handling to ensure the file is valid.
                if (!fileData.ok) {
                    console.error("Error loading file.", fileData);
                    return undefined;
                }

                // 3. Get the file contents to upload
                const blob = await fileData.blob();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": img.type },
                    body: blob,
                });
                if (!result.ok) {
                    // Note: You may actually want to inform the user of this.
                    console.log("Failed to upload.");
                    return undefined;
                }
                const { storageId } = await result.json();
                console.log(storageId)
                return storageId as Id<"_storage">
            }))
            
            if(newProduct && user && storageIds.length !==0){
                createNewProduct({name: newProduct.name, start_price: newProduct.start_price, images: storageIds.filter(p=>p!==undefined),userId:user?._id})
            }
            setIsLoading(false)
        } catch (e) {
            console.log(e)
            setIsLoading(false)
            ToastAndroid.show("Error encountered "+e,ToastAndroid.SHORT)
        }
    }
    const handleAuctionProduct = (_id: Id<"products">)=>{
        const product = products?.find(p=>p._id===_id)
        if (!product) {
            ToastAndroid.show("Product not found",ToastAndroid.SHORT)
            return 
        }
        Alert.alert("Auction "+product.name,
            `Are you sure you want to auction ${product.name}?`,
            [
                {text:"NO!",},
                {text:"Auction",onPress: async () => {
                    setIsLoading(true)
                    try {
                        await createNewAuction({ownerId: user?._id as Id<"users">,productId: _id})
                        setIsLoading(false)
                        router.navigate({pathname:"/"})
                        ToastAndroid.show("Auction created Successfully",ToastAndroid.SHORT)
                    } catch (error) {
                        setIsLoading(false)
                        console.log(error)
                        ToastAndroid.show("Failed to create Auction",ToastAndroid.SHORT)
                    }
                }}
            ]
        )
    }
    return (
        <>
            {isLoading?<OverlayLoading/>:null}
            <ModalWindow isDarkMode={theme==='dark'} onClose={()=>{setIsOpenModal(null); setSelectedProduct(null)}} isVisible={isOpenModal!==null}>
                {
                    isOpenModal?.category==='new_product'?(
                        <NewProduct
                            isDarkMode={theme==='dark'}
                            newProductHandler={newProductHandler}
                        />
                        ):(
                        <AuctionProduct
                            isDarkMode={theme==='dark'}
                            userId={user?._id}
                            handleAuctionProduct={handleAuctionProduct}
                            product={selectedProduct as Product}
                        />
                    )
                }
            </ModalWindow>
            <View style={{flex:1,padding: 12 , backgroundColor,}}>
                <SearchFilter 
                    callBackText={()=>{}}
                    isDarkMode={theme==='dark'}
                    additionalContainerStyle={{marginTop: 50}}
                    placeholder='Search Products'
                    onPress={()=>{}}
                    conditions={[]}
                    title="All Products"
                />
                <ColumnDisplay
                    data={products??[]}
                    callBackFc={async()=>{}}
                    isLoading={products===undefined}
                    keyExtractor={it=>it._id}
                    loadingItem='advert'
                    renderItem={({it})=>(
                        <ProductItem
                            it={it}
                            isDarkMode={false}
                            onAuctionPressed={()=>{
                                setSelectedProduct(it)
                                setIsOpenModal({category:'view_product'})
                                // it.userId===user?._id?handleAuctionProduct:undefined
                            }}
                        />
                    )}
                    isDarkMode={theme==='dark'}
                    emptyComponent={
                        <View style={{alignItems:'center', justifyContent:'center',marginTop:40}}>
                            <Image style={{height:100,width:100}} source={require('@/assets/images/auction.png')} />
                            <Text style={{textAlign:'center'}}>No products, create one</Text>
                        </View>
                    }
                />
                <View style={{position: 'absolute',alignItems: 'center', bottom: 30, right: 30,}}>
                    {
                        toggle?(
                            <Pressable onPress={()=>{setIsOpenModal({category:'new_product'});setToggle(!toggle)}} android_ripple={{color:'#f5f5f5'}}  style={{backgroundColor:'#f5f5f5',marginBottom: 10, padding: 10}}>
                                <Text>New Product</Text>
                            </Pressable>
                        ):null
                    }
                    <View style={{overflow: Platform.OS==='android'?'hidden':'visible',borderRadius: 25,}}>
                        <Pressable onPress={()=>setToggle(!toggle)} android_ripple={{color:'#f5f5f5'}}  style={styles.addButton}>
                            <MaterialCommunityIcons style={toggle ?{transform: [{ rotate: '45deg' }]}:{alignSelf:'center'}} size={25} name="plus" color={'white'} />
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
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
    addButton:{
        backgroundColor: 'red', 
        borderRadius: 25,
        padding: 10,
        width: 50,
        height: 50,
        justifyContent:'center',
        alignItems: 'center',
    },
});
type Product={
    images: (string | null)[];
    _id: Id<"products">;
    _creationTime: number;
    auctionId?: Id<"auctions"> | undefined;
    name: string;
    start_price: number;
    userId: Id<"users">;
}
function NewProduct({isDarkMode,newProductHandler}:{isDarkMode:boolean,newProductHandler: (p:{name:string,start_price:number ,images: {uri:string,type: string}[]})=>void}) {
    const [newProduct,setNewProduct] = useState<{name:string,start_price:number ,images: {uri:string,type: string}[]}| null>({name:'',start_price:0,images: []})

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true
        });
        console.log(result.assets)
        if (!result.canceled) {
            setNewProduct({...newProduct as unknown as any,images: result.assets.map(p=>({uri: p.uri, type: p.mimeType}))})
        }
    };
    return (
        <View style={{width:'100%'}}>
            <Text style={{fontSize:30,textAlign:'center',marginVertical:10,fontFamily:'MontserratSemiBold',}}>New Product</Text>
            <CustomTextInput
                name='name'
                color=''
                onChangeText={(_,v)=>setNewProduct({...newProduct as unknown as any,name: v})}
                placeholder='car'
                title='Name'
                value={newProduct?.name}
            />
            <CustomTextInput
                name='start_price'
                color=''
                keyboradType='numeric'
                onChangeText={(_,v)=>setNewProduct({...newProduct as unknown as any,start_price: parseInt(v)})}
                placeholder='e.g 2000'
                title='start_price'
                value={newProduct?.start_price? newProduct?.start_price.toString() as unknown as any: 0}
            />
            <Text style={{fontSize:20,textAlign:'center',marginVertical:1,fontFamily:'MontserratSemiBold',}}>Select Images</Text>
            <FlatList
                data={newProduct?.images}
                horizontal
                scrollEnabled
                ListEmptyComponent={()=>(
                    <View style={{ flex: 1,marginVertical:10,width: width, justifyContent: 'center', alignItems: 'center' }}>
                        <Pressable onPress={pickImage} style={{borderStyle:'dotted',justifyContent:'center',alignItems:'center',borderRadius:20,width:'80%',height: 200,borderWidth:.6,borderColor:'#ccc'}}>
                            <MaterialCommunityIcons onPress={pickImage} size={20} color='black' name='camera-image' />
                            <Text style={{fontSize:20,textAlign:'center',marginVertical:10,fontFamily:'MontserratSemiBold',}}>Click to select images</Text>
                        </Pressable>
                    </View>
                )}
                keyExtractor={(item) => item.toString()}
                renderItem={({item})=>(
                    <Image
                        source={{uri: item.uri}}
                        contentFit='fill'
                        style={{width:width*.8,marginHorizontal:10,marginVertical:10, height:300,borderRadius:20}}
                    />
                )}
            />
            <Pressable onPress={()=>{if(newProduct){newProductHandler(newProduct); setNewProduct(null)}else{return}}} style={[styles.button,{borderRadius:40,width:'50%',alignSelf:'center', backgroundColor:isDarkMode?'white':'black'}]}>
                <Text style={{fontFamily:'MontserratBold',color: isDarkMode?'black':'white'}}>ADD PRODUCT</Text>
            </Pressable>
        </View>
    )
}
function AuctionProduct({isDarkMode,product,userId,handleAuctionProduct}:{product: Product,userId?:Id<'users'>,handleAuctionProduct:(id:Id<'products'>)=>void,isDarkMode: boolean}){
    const [showDatePicker, setShowDatePicker] = useState<{category:'start_date'|'end_date',step: 1|2} | null>(null);
    const [auctionTimes,setAuctionTimes] = useState<{start_date: string,end_date: string}>({start_date:'',end_date:''})
    const onChangeDatetimePicker = (event: any, selectedDate: any | Date) => {
        if (showDatePicker?.step===2) {
            console.log(selectedDate,": time passed")
            const currentTime = new Date(selectedDate)
            const targetDate = new Date(showDatePicker.category);
            targetDate.setHours(currentTime.getHours());
            targetDate.setMinutes(currentTime.getMinutes());
            targetDate.setSeconds(currentTime.getSeconds());
            targetDate.setMilliseconds(currentTime.getMilliseconds());
            // Convert to ISO string
            const isoString = targetDate.toISOString();
            setAuctionTimes({...auctionTimes ,[showDatePicker?.category]: isoString})
            setShowDatePicker(null)
        }else if(showDatePicker?.step===1){
            // handle only the date
            const currentDate = new Date(selectedDate).toISOString().split('T')[0];
            setAuctionTimes({...auctionTimes ,[showDatePicker?.category]: currentDate})
            setShowDatePicker(prev=>({...prev as {category:'start_date'|'end_date',step: 1|2},step:2}))
            // setShowDatePicker({...showDatePicker as {category:'start_date'|'end_date',step: 1|2},step:2})
        }
    };
    return (
        <>
            {showDatePicker? (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode={showDatePicker.step===2?'time':'date'}
                    style={{width:width,height:200}}
                    is24Hour={true}
                    onChange={onChangeDatetimePicker}
                />
            ):null}
            <View>
                <Text style={{fontSize:20,textAlign:'center',marginVertical:1,fontFamily:'MontserratSemiBold'}}>{product.name}</Text>
                <FlatList
                    data={product.images??[]}
                    horizontal
                    scrollEnabled
                    ListEmptyComponent={()=>(
                        <View style={{ flex: 1,marginVertical:10,width: width, justifyContent: 'center', alignItems: 'center' }}>
                            <Pressable  style={{borderStyle:'dotted',justifyContent:'center',alignItems:'center',borderRadius:20,width:'80%',height: 200,borderWidth:.6,borderColor:'#ccc'}}>
                                <MaterialCommunityIcons size={20} color='black' name='camera-image' />
                                <Text style={{fontSize:20,textAlign:'center',marginVertical:10,fontFamily:'MontserratSemiBold',}}>Click to select images</Text>
                            </Pressable>
                        </View>
                    )}
                    keyExtractor={(item) => (item+""+Math.floor(Math.random()*100)).toString()}
                    renderItem={({item})=>(
                        <Image
                            source={{uri: item as string}}
                            contentFit='fill'
                            style={{width:width*.9,marginHorizontal:10,marginVertical:10, height:250,borderRadius:20}}
                        />
                    )}
                />
                {
                    (product.userId === userId)?(
                        <>
                            <CustomDatePicker 
                                color={isDarkMode?'#fff':'#000'} 
                                widthPassed={'90%'} 
                                onCalendarPress={()=>{
                                    setShowDatePicker({category:'start_date',step: showDatePicker?.step===1?2:1})
                                }} 
                                title='Start Date and Time'
                                value={auctionTimes?.start_date?new Date(auctionTimes?.start_date).toLocaleString():''}
                            />
                            <CustomDatePicker 
                                color={isDarkMode?'#fff':'#000'} 
                                widthPassed={'90%'} 
                                onCalendarPress={()=>{
                                    setShowDatePicker({category:'end_date',step: showDatePicker?.step===1?2:1})
                                }} 
                                title='End Date and Time'
                                value={auctionTimes?.end_date?new Date(auctionTimes?.end_date).toLocaleString():''}
                            />
                            <Pressable onPress={()=>handleAuctionProduct(product._id)} style={[styles.button,{borderRadius:40,width:'50%',alignSelf:'center',marginVertical:10, backgroundColor:isDarkMode?'white':'black'}]}>
                                <Text style={{fontFamily:'MontserratBold',color: isDarkMode?'black':'white'}}>AUCTION</Text>
                            </Pressable>
                        </>
                    ):null
                }
            </View>
        </>
    )
}