import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomTextInput from '@/components/shared/CustomTextInput'
import { Ionicons } from '@expo/vector-icons'
import {useAuthActions } from '@convex-dev/auth/react'
import { useColorScheme } from '@/hooks/use-color-scheme.web'

export default function SignIn() {
    const [step, setStep] = useState<"signUp" | "signIn">("signUp");
    const {signIn, } = useAuthActions()
    const theme = useColorScheme()
    const [email,setEmail] = useState('')
    const [password, setPassword]= useState('')
    
    
    const toggleSignInSignUp = ()=>{
        if(step==='signIn'){
            setStep('signUp')
        } else{
            setStep('signIn')
        }
    }
    return (
        <View style={styles.container}>
            <Text style={{fontSize:30,textAlign:'center',marginVertical:10,fontFamily:'MontserratSemiBold',}}>{step==="signIn"?"Sign in to your account ":"Create an account"}</Text>
            <CustomTextInput
                name='email'
                color=''
                onChangeText={(_,v)=>{setEmail(v)}}
                placeholder='name@example.com'
                title='Email'
                value={email}
            />
            <CustomTextInput
                name='password'
                color=''
                showPassword
                keyboradType='visible-password'
                onChangeText={(_,v)=>{setPassword(v)}}
                placeholder='******'
                title='Password'
                value={password}
            />
            <Pressable onPress={()=>{signIn('password',{email,password,flow: step})}} style={[styles.button,{borderRadius:40,width:'50%',backgroundColor:theme==='dark'?'white':'black'}]}>
                <Text style={{fontFamily:'MontserratBold',color: theme==='dark'?'black':'white'}}>SIGN IN</Text>
            </Pressable>
            <Pressable style={{marginVertical:10}} onPress={toggleSignInSignUp}>
                <Text style={{color:'#499dff'}}>
                    {
                        step==='signIn'?"Don't have an account? Sign up":"Have an account? Sign in"
                    }
                </Text>
            </Pressable>
            <View style={{flexDirection:'row',marginVertical:10,width:'100%',marginHorizontal:10,justifyContent:'center',alignItems:'center'}}>
                <View style={styles.line}/>
                <Text style={{textAlign:'center',marginHorizontal:10,}}>OR CONTINUE WITH</Text>
                <View style={styles.line}/>
            </View>
            <View style={styles.row}>
                <Pressable style={styles.button}>
                    <Ionicons name='logo-google' color={'#499dff'} size={20}/>
                    <Text style={{fontFamily:'MontserratRegular',marginHorizontal:5, fontSize:20}}>Google</Text>
                </Pressable>
                <Pressable style={styles.button}>
                    <Ionicons name='logo-github' size={20}/>
                    <Text style={{fontFamily:'MontserratRegular',marginHorizontal:5, fontSize:20}}>Github</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal:10,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical:15,
    },
    line: {
        borderBottomColor: 'black',
        flex:.9,
        borderBottomWidth: StyleSheet.hairlineWidth,
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
    }
})